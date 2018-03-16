const { acceptedMethods } = require('../http-resources')

module.exports = {
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
    message: `When you are invoking a resource, the accepted methods are: [${Object.keys(acceptedMethods).reduce((accumulator, item) => accumulator + ", " + item, '')}]`
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
