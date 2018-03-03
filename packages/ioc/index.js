const IOC = require('./lib/IOC')
const iocResolver = require('./lib/IOCResolver')
const ServiceNotFound = require('./lib/Errors/ServiceNotFound')

module.exports = {
  IOC,
  iocResolver,
  ServiceNotFound,
}
