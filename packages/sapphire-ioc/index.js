const IOC = require('./src/IOC')
const iocResolver = require('./src/IOCResolver')
const ServiceNotFound = require('./src/Errors/ServiceNotFound')

module.exports = {
  IOC,
  iocResolver,
  ServiceNotFound,
}
