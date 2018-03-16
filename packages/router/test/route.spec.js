const { Route, RouteTypes, HttpMethods } = require('../index')
const {
  CommentController,
  UserController,
  TaskController,
  TokenController,
} = require('./helpers/FakeControllers')

test('group Route exports 0 routes', () => {
  const route = new Route()

  route.group('/something', [], () => {})

  expect(route.export().length).toBe(0)
})

test('group with middlewares', () => {
  const route = new Route()

  route.group('/something', ['fake_middleware'], () => {
    route.group('/else', ['fake_middlwares_else'], () => {
      route.get('/foo', () => {

      })
    })
  })
})

test('every http method', () => {
  const route = new Route()

  route.put('/something', () => {})
  route.patch('/something', () => {})
  route.delete('/something', () => {})

  const routes = route.export()
  const firstRoute = routes[0]
  const secondRoute = routes[1]
  const thirdRoute = routes[2]

  expect(firstRoute).toMatchObject({
    route: '/something',
    type: RouteTypes.httpController,
    meta: {
      httpHandler: HttpMethods.put
    }
  })

  expect(secondRoute).toMatchObject({
    route: '/something',
    type: RouteTypes.httpController,
    meta: {
      httpHandler: HttpMethods.patch
    }
  })

  expect(thirdRoute).toMatchObject({
    route: '/something',
    type: RouteTypes.httpController,
    meta: {
      httpHandler: HttpMethods.delete
    }
  })
})

test('http route with 3 arguments', () => {
  const route = new Route()

  route.get('/something', [], () => {})

  const routes = route.export()
  expect(routes.length).toBe(1)
})

test('throws when the second parameter is not a function', () => {
  const route = new Route()

  expect(() => {
    route.get('/something', [])
  }).toThrow()

})

test('throws when the second parameter is not a function', () => {
  const route = new Route()

  expect(() => {
    route.get('/something', [], null)
  }).toThrow()

})

test('throws when the second parameter is not a function', () => {
  const route = new Route()

  expect(() => {
    route.get('/something', [], null, null, null)
  }).toThrow()

})

test('group Route with a get Route inside', () => {
  const route = new Route()

  route.group('/something', () => {
    route.get('/lol', () => {

    })

    route.post('/hey', () => {

    })
  })

  const routes = route.export()

  expect(routes.length).toBe(2)

  const firstRoute = routes[0]

  expect(firstRoute).toMatchObject({
    route: '/something/lol',
    type: RouteTypes.httpController,
    middlewares: [],
    meta: {
      httpHandler: HttpMethods.get
    }
  })
})

test('resource usecase: controller', () => {
  const route = new Route()

  // Case length 1
  route.resource('comment', new CommentController)

  const exportedRoutes = route.export()
  const firstRoute = exportedRoutes[0]
  expect(firstRoute).toMatchObject({
    route: '/comment',
    type: RouteTypes.httpController,
    middlewares: [],
    meta: {
      httpHandler: HttpMethods.get
    }
  })
})

test('resource usecase: middlewares, controller', () => {
  const route = new Route()

  // Case length 2
  route.resource('user', [], new UserController)

  const routes = route.export()
  const firstRoute = routes[0]
  expect(firstRoute).toMatchObject({
    route: '/user',
    type: RouteTypes.httpController,
    middlewares: [],
    meta: {
      httpHandler: HttpMethods.get
    }
  })
})

test('resource usecase: controller, callback', () => {
  const route = new Route()

  route.resource('user', new UserController, () => {} )

  const routes = route.export()
  const firstRoute = routes[0]
  expect(firstRoute).toMatchObject({
    route: '/user',
    type: RouteTypes.httpController,
    middlewares: [],
    meta: {
      httpHandler: HttpMethods.get
    }
  })
})

test('resource usecase: controller, options', () => {
  const route = new Route()

  route.resource('user', new UserController, { only: ['index'] })

  const routes = route.export()

  expect(routes.length).toBe(1)

  const firstRoute = routes[0]

  expect(firstRoute).toMatchObject({
    route: '/user',
    type: RouteTypes.httpController,
    middlewares: [],
    meta: {
      httpHandler: HttpMethods.get
    }
  })
})

test('resource usecase: controller, options', () => {
  const route = new Route()

  route.resource('token', new TokenController, { only: ['index']}, () => {

  })
})

test('resource usecase: middlwares, controller, callback', () => {
  const route = new Route()

  route.resource('task', [], new TaskController, () => {

  })

  const routes = route.export()

  expect(routes.length).toBe(7)
})

test('resource usecase: middlwares, controller, option', () => {
  const route = new Route()

  route.resource('comment', [], new CommentController, { only: ['index']})

  const routes = route.export()

  expect(routes.length).toBe(1)

  const firstRoute = routes[0]

  expect(firstRoute).toMatchObject({
    route: '/comment',
    type: RouteTypes.httpController,
    middlewares: [],
    meta: {
      httpHandler: HttpMethods.get
    }
  })
})

test('resource usecase: middlwares, controller, option, callback', () => {
  const route = new Route()

  route.resource('token', [], new TokenController, { only: ['index']}, () => {

  })

  const routes = route.export()

  expect(routes.length).toBe(1)

  const firstRoute = routes[0]

  expect(firstRoute).toMatchObject({
    route: '/token',
    type: RouteTypes.httpController,
    middlewares: [],
    meta: {
      httpHandler: HttpMethods.get
    }
  })
})

test('resources throw error', () => {
  const route = new Route()

  expect(() => {
    route.resource('token', null)
  }).toThrow()

  expect(() => {
    route.resource('token', null, null)
  }).toThrow()

  expect(() => {
    route.resource('token', null, null, null)
  }).toThrow()

  expect(() => {
    route.resource('token', null, null, null, null)
  }).toThrow()

  expect(() => {
    route.resource('token', null, null, null, null, null)
  }).toThrow()

  expect(() => {
    route.resource('token', new TokenController, { only: ['something']})
  }).toThrow()

  expect(() => {
    route.resource('something', new (class Something {}), { only: ['index']})
  }).toThrow()

  expect(() => {
    route.resource('something', new (class Something { get index() {}}), { only: ['index']})
  }).toThrow()

  expect(() => {
    route.resource('token', new TokenController, null)
  }).toThrow()
})
