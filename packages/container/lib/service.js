const instance = 1
const singleton = 2

/**
 * Represents a registered service.
 *
 * @class Service
 */
class Service {
  /**
   * Instance constant.
   *
   * @returns {int}
   */
  static get instance() {
    return instance
  }

  /**
   * Singleton constant.
   *
   * @returns {int}
   */
  static get singleton() {
    return singleton
  }

  /**
   * @param {function} callback
   * @param {int} type
   */
  constructor(callback, type) {
    this._instance = null
    this._callback = callback
    this._type = type
  }

  /**
   * Gets the registered instance.
   *
   * @public
   * @returns {*}
   */
  get() {
    if (this._type === Service.singleton) {
      // Set the instance for the first time.
      if (!this._instance) this._instance = this._callback()
      return this._instance
    }
    else {
      return this._callback()
    }
  }
}

module.exports = Service
