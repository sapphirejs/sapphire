const ServiceNotFound = require('./errors/service-not-found')
const Service = require('./service')

/**
 * IOC Container.
 *
 * @class Container
 */
class Container {
  constructor() {
    this._services = []
  }

  /**
   * Registers the result of the callback
   * to the list of services.
   *
   * @public
   * @param {*} identifier
   * @param {function} callback
   */
  register(identifier, callback) {
    this._registerService(identifier, callback, Service.instance)
  }

  /**
   * Registers the result of the callback
   * as a singleton to the list of services.
   * It will be initialized only once.
   *
   * @public
   * @param {*} identifier
   * @param {function} callback
   */
  singleton(identifier, callback) {
    this._registerService(identifier, callback, Service.singleton)
  }

  /**
   * Retrieves a registered service.
   *
   * @public
   * @param {*} identifier
   * @returns {*}
   */
  resolve(identifier) {
    const service = this._findService(identifier)
    return service.get()
  }

  /**
   * Retrieves a list of all registered
   * identifiers.
   *
   * @public
   * @returns {*}
   */
  identifiers() {
    return this._services.map(service => {
      const { identifier } = service
      return typeof identifier === "function" ? identifier.name : identifier
    })
  }

  /**
   * Creates the Service proxy and adds
   * it into the list.
   *
   * @private
   * @param {*} identifier
   * @param {function} callback
   * @param {int} type
   */
  _registerService(identifier, callback, type) {
    const service = new Service(callback, type)
    this._services.push({ identifier, service })
  }

  /**
   * Finds a service from the list.
   *
   * @private
   * @param {*} identifier
   * @returns {*}
   * @throws {ServiceNotFound} if a called service was not registered
   */
  _findService(identifier) {
    for (let service of this._services) {
      // Registered identifier is a Class.
      if (typeof service.identifier === "function" && service.identifier.name === identifier)
        return service.service

      // Registered identifier is a string literal.
      if (service.identifier === identifier)
        return service.service
    }

    throw new ServiceNotFound();
  }
}

module.exports = Container
