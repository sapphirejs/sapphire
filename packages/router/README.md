# Router

A fluent Router package that can be consumed with express or other routing packages.


## Quick usage

This package only generates a data structure that can be consumed by consumers.

```javascript
const { Route } = require('@sapphire/router')

const route = new Route()

route.group('/group', () => {
  route.get('/something', () => {

  })
})

route.export() // returns a data structure with routes
/**
 * [
 *    {
 *      route: '/group/something',
 *      type: 'http-controller',
 *      middlewares: [],
 *      handler: [Function],
 *      meta: { httpHandler: 'get' }
 *    }
 * ]
 */
```

Most of the packages treat the routing as a solid monolith solution. This package makes the process of building routes transparent and testable too. As it receives input data and generates a data structure, it is transparent on how it works, no magic here.


## Usage

```javascript
/**
 * Sample controllers
 */

class SimpleController {
  createPost() {

  }
}

class TokenController {
  index() {

  }
}

class UserController {
  index() {}
  create() {}
  store() {}
  show() {}
  edit() {}
  update() {}
  destroy() {}
}

class PhotoController {
  create() {

  }
}
```

```javascript
const { Route } = require('@sapphire/router')



const route = new Route()

route.post('/task', [/* put your custom middlware here */], new SimpleController)

route.group('/something', ['fake_middleware'], () => {
  route.group('/else', () => {
    route.get('/foo', () => {})
    route.patch('/foo', () => {})
  })
})

route.resource('token', new TokenController, { only: ['index']})

route.resource('user', ['some_middlware_here'], new UserController, () => {
  route.resource('photo', new PhotoController, { only: ['create']})
})

```

If your controller hasn't a method that is required by the router, we will throw an error so errors don't rise on "run-time".


## Beyond HTTP routes

This package is not only limited to HTTP routes but instead treats the HTTP as one of the ways the application receives data from the user. You can use it to build data structures about Console commands and WebSocket Channels.

```javascript
// Build this usecase
```
