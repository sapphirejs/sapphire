const Container = require('./lib/container')
const resolver = require('./lib/resolver')
const ServiceNotFound = require('./lib/errors/service-not-found')

module.exports = {
  Container,
  resolver,
  ServiceNotFound,
}
