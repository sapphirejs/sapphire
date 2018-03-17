module.exports = {
  callbackInvalid: (method) => ({
    title: `Provide a valid function to Route.${method}().`,
    code: `Route.${method}('/path', callback)`
  }),
  middlewareInvalid: (method) => ({
    title: `Provide a valid middleware to Route.${method}().`,
    code: `Route.${method}('/path', middleware, callback)`
  }),
  resourceControllerInvalid: () => ({
    title: `Provide a valid object to Route.resource().`,
    code: `Route.resource('/path', new Controller())`
  }),
  resourceMiddlewareInvalid: () => ({
    title: `Provide a valid middleware to Route.resource().`,
    code: `Route.resource('/path', middleware, new Controller())`
  }),
  controllerShouldHaveMethod: (controller, method) => ({
    title: `Resource Controller "${controller}" must implement method ${method}().`,
    code: `class ${controller} {\n  ${method}() {\n  //action\n  }`
  })
}
