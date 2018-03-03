const BIND = 1
const SINGLETON = 2

class Service {

  static get BIND() {
    return BIND
  }

  static get SINGLETON() {
    return SINGLETON
  }

  constructor(callback, type) {
    this._instance = null
    this._callback = callback
    this._type = type
  }

  make() {
    if (this._type === Service.SINGLETON) {
      if (this._instance === null)
        this._instance = this._callback()
      return this._instance
    } else {
      return this._callback()
    }
  }
}

module.exports = Service
