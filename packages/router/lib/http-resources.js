const HttpMethods = require('./http-methods')

module.exports = {
  acceptedMethods: {
    'index': HttpMethods.get,
    'create': HttpMethods.get,
    'store': HttpMethods.post,
    'show': HttpMethods.get,
    'edit': HttpMethods.get,
    'update': HttpMethods.put,
    'destroy': HttpMethods.delete,
  }
}
