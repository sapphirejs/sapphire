module.exports = {
  method: {
    get: 'get',
    post: 'post',
    put: 'put',
    patch: 'patch',
    delete: 'delete'
  },
  resourceMethods: {
    'index': 'get',
    'edit': 'get',
    'store': 'get',
    'show': 'get',
    'create': 'post',
    'update': 'put',
    'destroy': 'delete'
  },
  resourcePaths: {
    'index': '',
    'edit': '/:id/edit',
    'store': '/new',
    'show': '/:id',
    'create': '',
    'update': '/:id',
    'destroy': '/:id'
  },
  type: {
    http: 'http',
    command: 'command'
  }
}