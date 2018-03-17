const { Route, InvalidRouteArguments } = require('../index')
const settings = require('../lib/settings')
const { UserController, CommentController, TaskController } = require('./helpers/FakeControllers')

test('every http method', () => {
  const route = new Route()
  const cb = () => {}
  
  route.get('/path', cb)
  route.post('/path', cb)
  route.put('/path', cb)
  route.patch('/path', cb)
  route.delete('/path', cb)

  const routes = route.export()

  expect(routes.length).toBe(5)

  expect(routes[0]).toMatchObject({
    type: settings.type.http,
    path: '/path',
    middleware: null,
    handler: cb,
    meta: {
      method: settings.method.get
    }
  })

  expect(routes[1]).toMatchObject({
    type: settings.type.http,
    path: '/path',
    middleware: null,
    handler: cb,
    meta: {
      method: settings.method.post
    }
  })

  expect(routes[2]).toMatchObject({
    type: settings.type.http,
    path: '/path',
    middleware: null,
    handler: cb,
    meta: {
      method: settings.method.put
    }
  })

  expect(routes[3]).toMatchObject({
    type: settings.type.http,
    path: '/path',
    middleware: null,
    handler: cb,
    meta: {
      method: settings.method.patch
    }
  })

  expect(routes[4]).toMatchObject({
    type: settings.type.http,
    path: '/path',
    middleware: null,
    handler: cb,
    meta: {
      method: settings.method.delete
    }
  })
})

test('http route with only a callback', () => {
  const route = new Route()
  const cb = () => { }

  route.get('/path', cb)

  const routes = route.export()

  expect(routes.length).toBe(1)
  expect(routes[0].handler).toEqual(cb)
  expect(routes[0].middleware).toBeNull()
})

test('http route with middleware and callback', () => {
  const route = new Route()
  const cb = () => {}
  const mw = () => {}

  route.get('/path', mw, cb)

  const routes = route.export()
  
  expect(routes[0].middleware).toEqual(mw)
  expect(routes[0].handler).toEqual(cb)
})

test('http route with array of middleware', () => {
  const route = new Route()
  const mw = [() => {}, () => {}]

  route.get('/path', mw, () => {})

  const routes = route.export()

  expect(routes[0].middleware).toEqual(mw)
})

test('throws when http route does not have a callback', () => {
  const route = new Route()

  expect(() => {
    route.get('/path')
  }).toThrow(InvalidRouteArguments)
})

test('throws when http route callback is not a function', () => {
  const route = new Route()

  expect(() => {
    route.get('/path', 'hi')
  }).toThrow(InvalidRouteArguments)
})

test('throws when http route middleware is not a function', () => {
  const route = new Route()

  expect(() => {
    route.get('/path', 'hi', () => {})
  }).toThrow(InvalidRouteArguments)
})

test('throws when http route middleware is not an array of functions', () => {
  const route = new Route()

  expect(() => {
    route.get('/path', ['hi', 10], () => { })
  }).toThrow(InvalidRouteArguments)
})

test('http group', () => {
  const route = new Route()
  const cb = () => {}

  route.group('/path', (route) => {
    route.get('/hi', cb)
    route.post('/hey', cb)
  })

  const routes = route.export()

  expect(routes.length).toBe(2)

  expect(routes[0]).toMatchObject({
    type: settings.type.http,
    path: '/path/hi',
    middleware: null,
    handler: cb,
    meta: {
      method: settings.method.get
    }
  })

  expect(routes[1]).toMatchObject({
    type: settings.type.http,
    path: '/path/hey',
    middleware: null,
    handler: cb,
    meta: {
      method: settings.method.post
    }
  })
})

test('http group combines middleware', () => {
  const route = new Route()
  const cb = () => {}
  const mw = () => {}
  const mwGroup = () => {}

  route.group('/path', mwGroup, (route) => {
    route.get('/hi', mw, cb)
    route.get('/hi', [mw, mw], cb)
  })

  const routes = route.export()

  expect(routes[0].middleware).toEqual([mwGroup, mw])
  expect(routes[1].middleware).toEqual([mwGroup, mw, mw])
})

test('http group combines array middleware', () => {
  const route = new Route()
  const cb = () => {}
  const mw = () => {}
  const mwGroup = () => {}

  route.group('/path', [mwGroup, mwGroup], (route) => {
    route.get('/hi', mw, cb)
    route.get('/hi', [mw, mw], cb)
  })

  const routes = route.export()

  expect(routes[0].middleware).toEqual([mwGroup, mwGroup, mw])
  expect(routes[1].middleware).toEqual([mwGroup, mwGroup, mw, mw])
})

test('empty http group does not build routes', () => {
  const route = new Route()

  route.group('/path', () => {})

  const routes = route.export()

  expect(routes.length).toBe(0)
})

test('throws when http group does not have a callback', () => {
  const route = new Route()

  expect(() => {
    route.group('/path')
  }).toThrow(InvalidRouteArguments)
})

test('throws when http group callback is not a function', () => {
  const route = new Route()

  expect(() => {
    route.group('/path', 'hi')
  }).toThrow(InvalidRouteArguments)
})

test('throws when http group middleware is not a function', () => {
  const route = new Route()

  expect(() => {
    route.group('/path', 'hi', () => {})
  }).toThrow(InvalidRouteArguments)
})

test('throws when http group middleware is not an array of functions', () => {
  const route = new Route()

  expect(() => {
    route.group('/path', ['hi', 10], () => { })
  }).toThrow(InvalidRouteArguments)
})

test('http resource', () => {
  const route = new Route()
  const controller = new UserController()

  route.resource('/users', controller)

  expect(route.export()).toEqual([
    {
      type: settings.type.http,
      path: '/users',
      middleware: null,
      handler: controller.index,
      meta: {
        method: settings.method.get
      }
    },
    {
      type: settings.type.http,
      path: '/users/:id/edit',
      middleware: null,
      handler: controller.edit,
      meta: {
        method: settings.method.get
      }
    },
    {
      type: settings.type.http,
      path: '/users/new',
      middleware: null,
      handler: controller.store,
      meta: {
        method: settings.method.get
      }
    },
    {
      type: settings.type.http,
      path: '/users/:id',
      middleware: null,
      handler: controller.show,
      meta: {
        method: settings.method.get
      }
    },
    {
      type: settings.type.http,
      path: '/users',
      middleware: null,
      handler: controller.create,
      meta: {
        method: settings.method.post
      }
    },
    {
      type: settings.type.http,
      path: '/users/:id',
      middleware: null,
      handler: controller.update,
      meta: {
        method: settings.method.put
      }
    },
    {
      type: settings.type.http,
      path: '/users/:id',
      middleware: null,
      handler: controller.destroy,
      meta: {
        method: settings.method.delete
      }
    }
  ])
})

test('http resource with middleware', () => {
  const route = new Route()
  const controller = new UserController()
  const mw = () => {}

  route.resource('/users', mw, controller)

  const routes = route.export()

  expect(routes[0].middleware).toEqual(mw)
})

test('http resource with array of middleware', () => {
  const route = new Route()
  const controller = new UserController()
  const mw = [() => {}, () => {}]

  route.resource('/users', mw, controller)

  const routes = route.export()

  expect(routes[0].middleware).toEqual(mw)
})

test('http resource with "only" option', () => {
  const route = new Route()
  const controller = new UserController()

  route.resource('/users', controller, { only: ['index', 'create'] })

  expect(route.export()).toEqual([
    {
      type: settings.type.http,
      path: '/users',
      middleware: null,
      handler: controller.index,
      meta: {
        method: settings.method.get
      }
    },
    {
      type: settings.type.http,
      path: '/users',
      middleware: null,
      handler: controller.create,
      meta: {
        method: settings.method.post
      }
    },
  ])
})

test('http resource with "except" option', () => {
  const route = new Route()
  const controller = new UserController()

  route.resource('/users', controller, { except: ['index', 'edit', 'store', 'show', 'create'] })

  expect(route.export()).toEqual([
    {
      type: settings.type.http,
      path: '/users/:id',
      middleware: null,
      handler: controller.update,
      meta: {
        method: settings.method.put
      }
    },
    {
      type: settings.type.http,
      path: '/users/:id',
      middleware: null,
      handler: controller.destroy,
      meta: {
        method: settings.method.delete
      }
    },
  ])
})

test('http resource with just a callback', () => {
  const route = new Route()

  route.resource('/users', new UserController(), () => {})

  expect(route.export().length).toBe(7)
})

test('nested http resource', () => {
  const route = new Route()
  const userController = new UserController()
  const commentController = new CommentController()

  route.resource('/users', userController, { only: ['index'] }, (route) => {
    route.resource('/comments', commentController, { only: ['update'] })
  })

  expect(route.export()).toEqual([
    {
      type: settings.type.http,
      path: '/users',
      middleware: null,
      handler: userController.index,
      meta: {
        method: settings.method.get
      }
    },
    {
      type: settings.type.http,
      path: '/users/comments/:id',
      middleware: null,
      handler: commentController.update,
      meta: {
        method: settings.method.put
      }
    },
  ])
})

test('throws when resource controller does not implement a method', () => {
  const route = new Route()
  const controller = new TaskController()

  expect(() => {
    route.resource('/users', controller, { only: ['index'] })
  }).toThrow(InvalidRouteArguments)
})

test('throws when http resource controller is not an object', () => {
  const route = new Route()

  expect(() => {
    route.resource('/users', 'hi')
  }).toThrow(InvalidRouteArguments)
})

test('throws when http resource middleware is not a function', () => {
  const route = new Route()

  expect(() => {
    route.resource('/users', 'hi', new UserController())
  }).toThrow(InvalidRouteArguments)
})

test('throws when http resource middleware is not an array of functions', () => {
  const route = new Route()

  expect(() => {
    route.resource('/users', ['hi', 10], new UserController())
  }).toThrow(InvalidRouteArguments)
})