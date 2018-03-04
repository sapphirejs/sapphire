const IOC = require('./lib/ioc')
const iocResolver = require('./lib/ioc-resolver')
const ServiceNotFound = require('./lib/errors/service-not-found')

module.exports = {
  IOC,
  iocResolver,
  ServiceNotFound,
}
