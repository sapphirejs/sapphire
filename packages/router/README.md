# Router

A Route builder that produces a consumable data structure. It servers as a middleman between the client defined routes and consumers, which in turn use those routes in Express, socket server, console commands, or whatever the usecase is.


## Usage

```
$ npm install --save @sapphirejs/router
```

The router handles exactly what Express or any other router expects, with a few additions like groups and resources. For a quick overview:

```javascript
const { Route } = require('@sapphirejs/router')

const route = new Route()

route.get('/user/:id', callback)

route.export()

/**
 * [
 *    {
 *      path: '/users/:id',
 *      type: 'http',
 *      middleware: [],
 *      handler: [Function],
 *      meta: { method: 'get' }
 *    }
 * ]
 */
```

## Middleware

Middleware are also pretty much typical. They can be passed as a single function or an array of functions:

```js
route.get('/tasks', middleware, callback)
route.get('/jobs', [middleware1, middleware2], callback)
```

## Groups

Groups are very useful for routes with a common prefix, such as an `admin` panel:

```js
route.group('/admin', (route) => {
  // /admin/dashboard
  route.get('/dashboard', callback)
  // /admin/statistics
  route.get('/statistics', callback)
})
```

A group can have middleware applied to every sub route. Those will be combined with the route's own middleware, where the group's ones take precedence:

```js
route.group('/admin', groupMiddleware, (route) => {
  route.get('/dashboard', middleware, callback)
  route.get('/statistics', middleware)
})
```

## Resources

Resources are a shortcut for creating CRUD routes that respond to HTTP verbs. They define a number of paths that are expected to be handled by controller methods. If you imagine a `users` resource, it will generate the following paths with the respective verb and methods:

Path | Verb | Method
--- | --- | ---
/users | GET | index
/users/:id/edit | GET | edit
/users/new | GET | store
/users/:id | GET | show
/users | POST | create
/users/:id | PUT | update
/users/:id | DELETE | destroy

To generate the above, simply create a `UserController` class that implements all the methods and call it with:

```js
route.resource('/users', new UserController())
```

The default behaviour is to include both restful and non-restful methods for editing and creating data, but you can easily define which methods you want with the `only` option:

```js
route.resource('/users', new UserController(), { only: ['index', 'show', 'create'] })
```

Or exclude the methods you don't need with the `except` option:

```js
route.resource('/users', new UserController(), { except: ['edit', 'store'] })
```

Finally, resources can be nested to create relationship between data. Let's imagine the `user` has `comments`, which we want to define as a sub-resource:

```js
route.resource('/users', new UserController(), (route) => {
  route.resource('/comments', new ComentController())
})
```

It will generate every route for `/users`, but also for `/users/comments`.
