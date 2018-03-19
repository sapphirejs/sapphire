const BadCacheTransport = require('./errors/bad-cache-transport')

/**
 * Cache with multiple transports.
 *
 * @class Cache
 */
class Cache {
  /**
   * @param {Object} transport
   * @throws {BadCacheTransport} if the transport is not a valid object
   */
  constructor(transport) {
    if (!transport || typeof transport !== 'object')
      throw new BadCacheTransport('Use a valid Mail transport.')

    this._transport = transport
  }

  /**
   * Gets the value of a key.
   *
   * @public
   * @param {string} key
   */
  get(key) {
    return this._transport.get(key)
  }

  /**
   * Sets the value of a key.
   *
   * @public
   * @param {string} key
   * @param {*} value
   * @param {int} minutes
   */
  set(key, value, minutes = 60) {
    return this._transport.set(key, value, minutes)
  }

  /**
   * Sets the value of a key with a big
   * expiry time.
   *
   * @public
   * @param {string} key
   * @param {*} value
   */
  forever(key, value) {
    return this.set(key, value, 60 * 24 * 30 * 365)
  }

  /**
   * Increment a key by amount.
   *
   * @public
   * @param {string} key
   * @param {int} amount
   */
  increment(key, amount = 1) {
    return this._transport.increment(key, amount)
  }

  /**
   * Decrement a key by amount.
   *
   * @public
   * @param {string} key
   * @param {int} amount
   */
  decrement(key, amount = 1) {
    return this._transport.decrement(key, amount)
  }

  /**
   * Gets the key and deletes it.
   *
   * @public
   * @param {string} key
   */
  pop(key) {
    const value = this.get(key)
    this.delete(key)
    return value
  }

  /**
   * Checks if a key exists.
   *
   * @public
   * @param {string} key
   */
  has(key) {
    return this._transport.has(key)
  }

  /**
   * Deletes a key.
   *
   * @public
   * @param {string} key
   */
  delete(key) {
    return this._transport.delete(key)
  }

  /**
   * Deletes all the keys.
   *
   * @public
   */
  flush() {
    return this._transport.flush()
  }
}

module.exports = Cache
