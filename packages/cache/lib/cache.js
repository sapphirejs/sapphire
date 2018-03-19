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
   * @returns {Promise} with the value of key
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
   * @returns {Promise}
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
   * @returns {Promise}
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
   * @returns {Promise} with the new value of key
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
   * @returns {Promise} with the new value of key
   */
  decrement(key, amount = 1) {
    return this._transport.decrement(key, amount)
  }

  /**
   * Set the value of the key only if it
   * already exists.
   *
   * @public
   * @param {string} key
   * @param {*} value
   * @param {int} minutes
   * @returns {Promise}
   */
  async override(key, value, minutes = 60) {
    if (await this.has(key))
      return this.set(key, value, minutes)
    return null
  }

  /**
   * Gets the key and deletes it.
   *
   * @public
   * @param {string} key
   * @returns {*}
   */
  async pop(key) {
    const value = await this.get(key)
    await this.delete(key)
    return value
  }

  /**
   * Checks if a key exists.
   *
   * @public
   * @param {string} key
   * @returns {Promise} boolean
   */
  has(key) {
    return this._transport.has(key)
  }

  /**
   * Deletes a key.
   *
   * @public
   * @param {string} key
   * @returns {Promise}
   */
  delete(key) {
    return this._transport.delete(key)
  }

  /**
   * Deletes all the keys.
   *
   * @public
   * @returns {Promise}
   */
  flush() {
    return this._transport.flush()
  }
}

module.exports = Cache
