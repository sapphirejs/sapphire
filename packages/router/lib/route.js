const is = require('is')
const routeTypes = require('./route-types')
const httpMethods = require('./http-methods')
const { acceptedMethods } = require('./http-resources')
const errorMessages = require('./errors/messages')
const InvalidRouteArgument = require('./errors/InvalidRouteArguments')

const defaultResourceOption = { only: ['index', 'create', 'store', 'show', 'edit', 'update', 'destroy'] }

class Route {
  constructor() {
    this._prefixes = []
    this._middlewares = []
    this._routes = []
  }

  export() {
    const route = this._routes
    this._routes = []
    return route
  }

  get(prefix, ...params) {
    this._buildHttp(prefix, params, httpMethods.get)
  }

  post(prefix, ...params) {
    this._buildHttp(prefix, params, httpMethods.post)
  }

  put(prefix, ...params) {
    this._buildHttp(prefix, params, httpMethods.put)
  }

  patch(prefix, ...params) {
    this._buildHttp(prefix, params, httpMethods.patch)
  }

  delete(prefix, ...params) {
    this._buildHttp(prefix, params, httpMethods.delete)
  }

  group(prefix, ...params) {
    this._buildHttp(prefix, params, 'group')
  }

  resource(prefix, ...params) {
    switch (params.length) {
      case 1: {
        const controller = params[0]
        if (is.object(controller)) {
          this._buildHttpResource(prefix, [], controller, { only: Object.keys(acceptedMethods) })
        } else {
          throw new InvalidRouteArgument(errorMessages.resourceTwoArgument())
        }
        break
      }
      case 2: {
        const firstParam = params[0]
        const secondParam = params[1]
        if (is.array(firstParam) && is.object(secondParam)) {
          // middleware, controller
          this._buildHttpResource(prefix, firstParam, secondParam)
        } else if (is.object(firstParam) && is.function(secondParam)) {
          // controller, callback (nested resource)
          this._buildHttpResource(prefix, [], firstParam, )
        } else if (is.object(firstParam) && is.object(secondParam)) {
          // controller, options
          this._buildHttpResource(prefix, [], firstParam, secondParam)
        } else {
          throw new InvalidRouteArgument(errorMessages.resourceThreeArguments())
        }
        break
      }
      case 3: {
        const firstParam = params[0]
        const secondParam = params[1]
        const thirdParam = params[2]
        if (is.object(firstParam) && is.object(secondParam) && is.function(thirdParam)) {
          // controller, options, callback (nested resources)
          this._buildHttpResource(prefix, [], firstParam, secondParam, thirdParam)
        } else if (is.array(firstParam) && is.object(secondParam) && is.function(thirdParam)) {
          // middlewares, controller, callback
          this._buildHttpResource(prefix, firstParam, secondParam, defaultResourceOption, thirdParam)
        } else if (is.array(firstParam) && is.object(secondParam) && is.object(thirdParam)) {
          // middlewares, controller, options
          this._buildHttpResource(prefix, firstParam, secondParam, thirdParam)
        } else {
          throw new InvalidRouteArgument(errorMessages.resourceFourArguments())
        }
        break
      }
      case 4: {
        const firstParam = params[0]
        const secondParam = params[1]
        const thirdParam = params[2]
        const fourthParameter = params[3]
        if (is.array(firstParam) && is.object(secondParam) && is.object(thirdParam) && is.function(fourthParameter)) {
          // middlewares, controller, options, callback
          this._buildHttpResource(prefix, firstParam, secondParam, thirdParam, fourthParameter)
        } else {
          throw new InvalidRouteArgument(errorMessages.resourceFiveArguments())
        }
        break
      }
      default:
        throw new InvalidRouteArgument(errorMessages.resourceMoreThanFiveArguments())
    }
  }

  _buildHttpResource(prefix, middlewares, controller, options = defaultResourceOption, resourceCallback = null) {
    this._prefixes.push(prefix)

    // We only accept only for now, throw an exception if only is not on option.
    options.only.forEach(item => {
      if (!acceptedMethods.hasOwnProperty(item))
        throw new InvalidRouteArgument(errorMessages.resourceShouldHaveOnlyKeys().message)

      if (!Object.hasOwnProperty(item) && !is.function(controller[item]))
        throw new InvalidRouteArgument(errorMessages.controllerShouldHavemethod(item).message)

      this._routes.push({
        route: this._buildPrefix(),
        type: routeTypes.httpController,
        middlewares: [...this._middlewares, ...middlewares],
        handler: controller[item],
        meta: {
          httpHandler: acceptedMethods[item]
        }
      })

      if (resourceCallback !== null)
        resourceCallback()
    })

    this._prefixes.pop()
  }

  _buildHttpMethod(prefix, cb, method, middlewares = []) {
    this._prefixes.push(prefix)
    this._routes.push({
      route: this._buildPrefix(),
      type: routeTypes.httpController,
      middlewares: [...this._middlewares, ...middlewares],
      handler: cb,
      meta: {
        httpHandler: method
      }
    })
    this._prefixes.pop()
  }

  _buildHttp(prefix, params, method) {
    if (params.length === 1) {
      const callback = params[0]
      if (is.function(callback)) {
        this._isHttpMethod(method)
          ? this._buildHttpMethod(prefix, callback, method)
          : this._buildGroup(prefix, callback)
      } else {
        throw new InvalidRouteArgument(errorMessages.secondArgFunction(method))
      }
    } else if (params.length === 2) {
      const middlwares = params[0]
      const callback = params[1]
      if (
        is.array(middlwares) &&
        is.function(callback)
      ) {
        this._isHttpMethod(method)
          ? this._buildHttpMethod(prefix, callback, method, middlwares)
          : this._buildGroup(prefix, callback, middlwares)
      } else {
        throw new InvalidRouteArgument(errorMessages.secondArgObjectThirdFunc(method))
      }
    } else {
      throw new InvalidRouteArgument()
    }
  }

  _isHttpMethod(method) {
    return Object
      .keys(httpMethods)
      .reduce((acc, key) => {
        return key === method ? true : acc
      }, false)
  }

  _buildPrefix() {
    return this._prefixes
      .reduce((acc, prefix) => {
        return `/${acc}/${prefix}`.replace('//', '/').replace('//', '/')
      }, '')
  }

  _buildGroup(prefix, cb, middlewares = []) {
    this._prefixes.push(prefix)
    if (middlewares.length !== 0)
      this._middlewares.push(middlewares)
    cb()
    if (middlewares.length !== 0)
      this._middlewares.pop()
    this._prefixes.pop()
  }
}

module.exports = Route
