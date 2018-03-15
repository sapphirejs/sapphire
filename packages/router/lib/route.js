const { BadArguments } = require('@sapphirejs/commons')
const is = require('is')
const RouteTypes = require('./route-types')
const HttpMethods = require('./http-methods')
const { acceptedMethods } = require('./http-resources')

const ErrorMessages = {
  secondArgFunction: (method) =>
    `When you are invoking a function like '${method}' with 2 arguments, the second one should be a function. For example: \n\n` +
    `Route.group('/base-route', () => { \n  Route.get('/nested-route', ExampleController.index) \n})`,
  secondArgObjectThirdFunc: (method) =>
    `When you are invoking a function like '${method}' with 3 arguments, the second one should be an array of middlewares and the ` +
    `third argument a function. For example: \n\n` +
    `Route.group('/base-route', [], () => { \n  Route.get('/nested-route', ExampleController.index) \n})`,
  // moreThanXArguments: (object, method, maxArguments) =>
  //   `You can't invoke ${object}.${method} with more than ${maxArguments} ${maxArguments}`,
  resourceShouldHaveOnlyKeys: () => ({
    message: `When you are invoking a resource, the accepted methods are: [${Object.keys(acceptedMethods).reduce((accumulator, item) => accumulator + ", " + item , '')}]`
  }),
  controllerShouldHavemethod: (methodName) => ({
    message: `When you are invoking a resource, the controller should have the method ${methodName}`
  }),
  // resourceCallbackShouldBeACallback: () => ({
  //   message: `When you are using resources and trying to do nested groups, the last parameter should be a callback`
  // }),
  resourceTwoArgument: () => ({
    message: `When you are using resources with 2 parameters, it should be like one of the following examples:`
  }),
  resourceThreeArguments: () => ({
    message: `When you are using resources with 3 parameters, it should be like one of the following examples:`
  }),
  resourceFourArguments: () => ({
    message: `When you are using resources with 4 parameters, it should be like one of the following examples:`
  }),
  resourceFiveArguments: () => ({
    message: `When you are using resources with 5 parameters, it should be like one of the following examples:`
  }),
  resourceMoreThanFiveArguments: () => ({
    message: `Resource can take up to 5 arguments but no more than that:`
  })
}

const defaultResourceOption = { only: ['index', 'create', 'store', 'show', 'edit', 'update', 'destroy']}

class Route {

  constructor(){
    this.__prefixes = []
    this.__middlewares = []
    this.__routes = []
  }

  export() {
    const route = this.__routes
    this.__routes = []
    return route
  }

  get(prefix, ...otherParams) {
    this.__buildHttp(prefix, otherParams, HttpMethods.get)
  }

  post(prefix, ...otherParams) {
    this.__buildHttp(prefix, otherParams, HttpMethods.post)
  }

  put(prefix, ...otherParams) {
    this.__buildHttp(prefix, otherParams, HttpMethods.put)
  }

  patch(prefix, ...otherParams) {
    this.__buildHttp(prefix, otherParams, HttpMethods.patch)
  }

  delete(prefix, ...otherParams) {
    this.__buildHttp(prefix, otherParams, HttpMethods.delete)
  }

  group(prefix, ...otherParams) {
    this.__buildHttp(prefix, otherParams, 'group')
  }

  resource(prefix, ...otherParams) {
    switch(otherParams.length) {
      case 1: {
        const controller = otherParams[0]
        if(is.object(controller)){
          this.__buildHttpResource(prefix, [], controller, { only: Object.keys(acceptedMethods) })
        }else{
          throw new BadArguments(ErrorMessages.resourceTwoArgument())
        }
        break
      }
      case 2: {
        const firstParam = otherParams[0]
        const secondParam = otherParams[1]
        if(is.array(firstParam) && is.object(secondParam)) {
          // middleware, controller
          this.__buildHttpResource(prefix, firstParam, secondParam)
        }else if(is.object(firstParam) && is.function(secondParam)) {
          // controller, callback (nested resource)
          this.__buildHttpResource(prefix, [], firstParam, )
        }else if(is.object(firstParam) && is.object(secondParam)) {
          // controller, options
          this.__buildHttpResource(prefix, [], firstParam, secondParam)
        } else {
          throw new BadArguments(ErrorMessages.resourceThreeArguments())
        }
        break
      }
      case 3: {
        const firstParam = otherParams[0]
        const secondParam = otherParams[1]
        const thirdParam = otherParams[2]
        if(is.object(firstParam) && is.object(secondParam) && is.function(thirdParam)) {
          // controller, options, callback (nested resources)
          this.__buildHttpResource(prefix, [], firstParam, secondParam, thirdParam)
        }else if(is.array(firstParam) && is.object(secondParam) && is.function(thirdParam)) {
          // middlewares, controller, callback
          this.__buildHttpResource(prefix, firstParam, secondParam, defaultResourceOption, thirdParam)
        }else if(is.array(firstParam) && is.object(secondParam) && is.object(thirdParam)) {
          // middlewares, controller, options
          this.__buildHttpResource(prefix, firstParam, secondParam, thirdParam)
        }else {
          throw new BadArguments(ErrorMessages.resourceFourArguments())
        }
        break
      }
      case 4: {
        const firstParam = otherParams[0]
        const secondParam = otherParams[1]
        const thirdParam = otherParams[2]
        const fourthParameter = otherParams[3]
        if(is.array(firstParam) && is.object(secondParam) && is.object(thirdParam) && is.function(fourthParameter)) {
          // middlewares, controller, options, callback
          this.__buildHttpResource(prefix, firstParam, secondParam, thirdParam, fourthParameter)
        } else {
          throw new BadArguments(ErrorMessages.resourceFiveArguments())
        }
        break
      }
      default:
        throw new BadArguments(ErrorMessages.resourceMoreThanFiveArguments())
    }
  }

  __buildHttpResource(prefix, middlewares, controller, options = defaultResourceOption, resourceCallback = null) {
    this.__prefixes.push(prefix)

    // We only accept only for now, throw an exception if only is not on option

    options.only.forEach(item => {
      if(!acceptedMethods.hasOwnProperty(item))
        throw new BadArguments(ErrorMessages.resourceShouldHaveOnlyKeys().message)

      if(!Object.hasOwnProperty(item) && !is.function(controller[item]))
        throw new BadArguments(ErrorMessages.controllerShouldHavemethod(item).message)

      this.__routes.push({
        route: this.__buildPrefix(),
        type: RouteTypes.httpController,
        middlewares: [...this.__middlewares, ...middlewares],
        handler: controller[item],
        meta: {
          httpHandler: acceptedMethods[item]
        }
      })

      if(resourceCallback !== null)
        resourceCallback()

    })

    this.__prefixes.pop()
  }

  __buildHttpMethod(prefix, cb, method, middlewares = []) {
    this.__prefixes.push(prefix)
    this.__routes.push({
      route: this.__buildPrefix(),
      type: RouteTypes.httpController,
      middlewares: [...this.__middlewares, ...middlewares],
      handler: cb,
      meta: {
        httpHandler: method
      }
    })
    this.__prefixes.pop()
  }

  __buildHttp(prefix, otherParams, method) {

    if(otherParams.length === 1) {
      const callback = otherParams[0]
      if(is.function(callback)) {
        this.__isHttpMethod(method)
          ? this.__buildHttpMethod(prefix, callback, method)
          : this.__buildGroup(prefix, callback)
      } else {
        throw new BadArguments(ErrorMessages.secondArgFunction(method))
      }
    }else if(otherParams.length === 2) {
      const middlwares = otherParams[0]
      const callback = otherParams[1]
      if(
        is.array(middlwares) &&
        is.function(callback)
      ){
        this.__isHttpMethod(method)
          ? this.__buildHttpMethod(prefix, callback, method, middlwares)
          : this.__buildGroup(prefix, callback, middlwares)
      } else {
        throw new BadArguments(ErrorMessages.secondArgObjectThirdFunc(method))
      }
    }else {
      throw new BadArguments()
    }


  }

  __isHttpMethod(method) {
    return Object.keys(HttpMethods).reduce(
      (accumulator, key) =>
        key === method ? true : accumulator
      , false
    )
  }

  __buildPrefix() {
    return this.__prefixes.reduce(
      (accumulator, prefix) =>
        `/${accumulator}/${prefix}`.replace('//', '/').replace('//', '/')
      , ""
    )
  }

  __buildGroup(prefix, cb, middlewares = []) {
    this.__prefixes.push(prefix)
    if(middlewares.length !== 0)
      this.__middlewares.push(middlewares)
    cb()
    if(middlewares.length !== 0)
      this.__middlewares.pop()
    this.__prefixes.pop()
  }

}

module.exports = Route
