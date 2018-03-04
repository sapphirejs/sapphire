const ServiceNotFound = require('./errors/service-not-found')
const Service = require('./service')

class IOC {
  constructor() {
    this._services = []
  }

  __registerService(identifier, callback, type) {
    const service = new Service(callback, type)

    this._services.push({
      identifier,
      service
    })
  }

  __findService(identifier) {
    for (let service of this._services) {
      if(typeof service.identifier === "function" && service.identifier.name === identifier)
        return service.service

      if (service.identifier === identifier)
        return service.service
    }
    throw new ServiceNotFound();
  }

  bind(identifier, callback) {
    this.__registerService(identifier, callback, Service.BIND)
  }

  singleton(identifier, callback) {
    this.__registerService(identifier, callback, Service.SINGLETON)
  }

  make(identifier) {
    let service = this.__findService(identifier)
    return service.make()
  }

  allIdentifiers() {
    return this._services.map(service => {
      const { identifier } = service
      return typeof identifier === "function" ? identifier.name : identifier
    })
  }
}

module.exports = IOC
