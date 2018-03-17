const is = require('./is')
const settings = require('./settings')
const errors = require('./errors/messages')
const InvalidRouteArguments = require('./errors/invalid-route-arguments')

/**
 * Route structure builder.
 *
 * @class Route
 */
class Route {
  constructor() {
    this._routes = []
  }

  /**
   * Returns the built routes.
   *
   * @public
   * @returns {Object[]}
   */
  export() {
    return this._routes
  }

  /**
   * HTTP GET.
   *
   * @public
   * @param {string} path
   * @param {array} params
   */
  get(path, ...params) {
    this._buildRoute(settings.method.get, path, params)
  }

  /**
   * HTTP POST.
   *
   * @public
   * @param {string} path
   * @param {array} params
   */
  post(path, ...params) {
    this._buildRoute(settings.method.post, path, params)
  }

  /**
   * HTTP PUT.
   *
   * @public
   * @param {string} path
   * @param {array} params
   */
  put(path, ...params) {
    this._buildRoute(settings.method.put, path, params)
  }

  /**
   * HTTP PATCH.
   *
   * @public
   * @param {string} path
   * @param {array} params
   */
  patch(path, ...params) {
    this._buildRoute(settings.method.patch, path, params)
  }

  /**
   * HTTP DELETE.
   *
   * @public
   * @param {string} path
   * @param {array} params
   */
  delete(path, ...params) {
    this._buildRoute(settings.method.delete, path, params)
  }

  /**
   * Group routes.
   *
   * @public
   * @param {string} path
   * @param {array} params
   */
  group(path, ...params) {
    this._buildRoute('group', path, params)
  }

  /**
   * Resource routes.
   *
   * @public
   * @param {string} path
   * @param {array} params
   */
  resource(path, ...params) {
    this._buildResource(path, params)
  }

  /**
   * Builds an HTTP route or a group.
   *
   * @private
   * @param {string} method
   * @param {string} path
   * @param {array} params
   * @throws {InvalidRouteArguments} when callback or middleware is invalid
   */
  _buildRoute(method, path, params) {
    const [middleware, callback] = params
    // Callback may be either the first or second parameter.
    const routeCallback = is.callback(callback)
      ? callback
      : is.callback(middleware) ? middleware : null
    // Middleware may be only the first parameter if the
    // callback is provided.
    const routeMiddleware = is.middleware(middleware) && is.callback(callback)
      ? middleware
      : null

    if (!routeCallback)
      throw new InvalidRouteArguments(
        errors.callbackInvalid(method).title,
        errors.callbackInvalid(method).code
      )

    if (callback && !routeMiddleware)
      throw new InvalidRouteArguments(
        errors.middlewareInvalid(method).title,
        errors.middlewareInvalid(method).code
      )

    method === 'group'
      ? this._addGroup(path, routeCallback, routeMiddleware)
      : this._addHttpRoute(method, path, routeCallback, routeMiddleware)
  }

  /**
   * Builds a resource.
   *
   * @private
   * @param {string} path
   * @param {array} params
   */
  _buildResource(path, params) {
    const [middleware, controller, options, callback] = params

    // Middleware may be only the first parameter.
    const rscMiddleware = is.middleware(middleware) ? middleware : null
    // Controller may be either the first or the second.
    // Check if it's not a valid middleware but an object.
    const rscController = is.object(middleware) && !Array.isArray(middleware)
      ? middleware
      : is.object(controller) ? controller : null
    // Options may be either the second or the third.
    // Without a middleware it may be the second. Otherwise it may
    // be the third.
    const rscOptions = is.object(controller) && !rscMiddleware
      ? controller
      : is.object(options) ? options : null
    // Callback for nested resources may be the second, third or fourth.
    // Without a middleware and options it may be the second.
    // With middleware the third and with options the fourth.
    const rscCallback = is.callback(controller) && !rscMiddleware
      ? controller
      : is.callback(options)
        ? options
        : is.callback(callback) ? callback : null

    if (!rscController)
      throw new InvalidRouteArguments(
        errors.resourceControllerInvalid().title,
        errors.resourceControllerInvalid().code
      )

    // Controller isn't the first parameter, expecting a middleware
    // but the middleware wasn't valid.
    if (rscController !== middleware && !rscMiddleware)
      throw new InvalidRouteArguments(
        errors.resourceMiddlewareInvalid().title,
        errors.resourceMiddlewareInvalid().code
      )

    this._addResource(path, rscController, rscMiddleware, rscOptions, rscCallback)
  }

  /**
   * Adds an http route.
   *
   * @private
   * @param {string} method
   * @param {string} path
   * @param {function} callback
   * @param {function|function[]} middleware
   */
  _addHttpRoute(method, path, callback, middleware) {
    this._routes.push({
      type: settings.type.http,
      path: path,
      middleware: middleware,
      handler: callback,
      meta: {
        method: method
      }
    })
  }

  /**
   * Resolves and adds a group.
   *
   * @private
   * @param {string} path
   * @param {function} callback
   * @param {function|function[]} middleware
   */
  _addGroup(path, callback, middleware) {
    this._callNested(path, callback, middleware)
  }

  /**
   * Resolves and adds a resource.
   *
   * @private
   * @param {string} path
   * @param {Object} controller
   * @param {function|function[]} middleware
   * @param {Object} options
   * @param {function} callback
   * @throws {InvalidRouteArguments} if the controller doesn't implement a method
   */
  _addResource(path, controller, middleware, options, callback) {
    const methods = this._resolveResourceMethods(options)

    methods.forEach(method => {
      if (!controller[method] || !is.callback(controller[method]))
        throw new InvalidRouteArguments(
          errors.controllerShouldHaveMethod(controller.constructor.name, method).title,
          errors.controllerShouldHaveMethod(controller.constructor.name, method).code
        )

      this._addHttpRoute(
        settings.resourceMethods[method],
        `${path}${settings.resourcePaths[method]}`,
        controller[method],
        middleware
      )
    })

    if (callback)
      this._callNested(path, callback, middleware)
  }

  /**
   * Resolves a nested group or resource callback.
   *
   * @param {string} path
   * @param {function} callback
   * @param {function|function[]} middleware
   */
  _callNested(path, callback, middleware) {
    // Pass the fresh route object as a parameter
    // so that it's routes can be injected into
    // the actual scope.
    const route = new Route()
    callback(route)

    route
    .export()
    .forEach(route => {
      this._addHttpRoute(
        route.meta.method,
        `${path}/${route.path}`.replace('//', '/'),
        route.handler,
        this._combineMiddleware(middleware, route.middleware),
      )
    })
  }

  /**
   * Combines two different values into an
   * array of middleware.
   *
   * @private
   * @param {*} first
   * @param {*} second
   * @returns {null|array}
   */
  _combineMiddleware(first, second) {
    if (!first && !second) return null
    if (Array.isArray(first) && Array.isArray(second)) return [...first, ...second]
    if (Array.isArray(first)) return [...first, second]
    if (Array.isArray(second)) return [first, ...second]
    if (!first) return [second]
    if (!second) return [first]
    return [first, second]
  }

  /**
   * Resolves resource options.
   *
   * @private
   * @param {Object} options
   * @returns {array}
   */
  _resolveResourceMethods(options) {
    const allMethods = Object.keys(settings.resourceMethods)
    const only = options && options.only || allMethods
    const except = options && options.except || []

    return Object.keys(settings.resourceMethods)
      .filter(method => {
        return only.includes(method)
      })
      .filter(method => {
        return !except.includes(method)
      })
  }
}

module.exports = Route
