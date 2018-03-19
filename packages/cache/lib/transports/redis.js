const redis = require('redis')

/**
 * Redis cache transport.
 *
 * @class Redis
 */
class Redis {
  /**
   *
   * @param {Object} config
   */
  constructor(config = {}) {
    this._redis = redis.createClient(config)
    this._prefix = config.prefix || 'cache_'
  }

  /**
   * Gets the value of a key.
   *
   * @public
   * @param {string} key
   * @returns {Promise}
   */
  get(key) {
    return new Promise((resolve, reject) => {
      this._redis.get(this._setPrefix(key), (err, value) => {
        if (err) reject(err)
        resolve(this._decodeValue(value))
      })
    })
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
  set(key, value, minutes) {
    return new Promise((resolve, reject) => {
      const seconds = minutes * 60
      this._redis.setex(this._setPrefix(key), seconds, this._encodeValue(value), err => {
        if (err) reject(err)
        resolve()
      })
    })
  }

  /**
   * Increment a key by amount.
   *
   * @public
   * @param {string} key
   * @param {int} amount
   * @returns {Promise}
   */
  increment(key, amount) {
    return new Promise((resolve, reject) => {
      this._redis.incrby(key, amount, (err, value) => {
        if (err) reject(err)
        resolve(this._decodeValue(value))
      })
    })
  }

  /**
   * Decrement a key by amount.
   *
   * @public
   * @param {string} key
   * @param {int} amount
   * @returns {Promise}
   */
  decrement(key, amount) {
    return new Promise((resolve, reject) => {
      this._redis.decrby(key, amount, (err, value) => {
        if (err) reject(err)
        resolve(this._decodeValue(value))
      })
    })
  }

  /**
   * Checks if a key exists.
   *
   * @public
   * @param {string} key
   * @returns {Promise}
   */
  has(key) {
    return new Promise((resolve, reject) => {
      this._redis.exists(this._setPrefix(key), (err, exists) => {
        if (err) reject(err)
        resolve(!!exists)
      })
    })
  }

  /**
   * Deletes a key.
   *
   * @public
   * @param {string} key
   * @returns {Promise}
   */
  delete(key) {
    return new Promise((resolve, reject) => {
      this._redis.del(this._setPrefix(key), (err, deleted) => {
        if (err) reject(err)
        resolve(!!deleted)
      })
    })
  }

  /**
   * Deletes all the keys in the database.
   *
   * @public
   * @returns {Promise}
   */
  flush() {
    return new Promise((resolve, reject) => {
      this._redis.flushdb(err => {
        if (err) reject(err)
        resolve()
      })
    })
  }

  /**
   * Prepends the prefix to the key.
   *
   * @private
   * @param {string} key
   * @returns {String}
   */
  _setPrefix(key) {
    return `${this._prefix}${key}`
  }

  /**
   * Converts a JSON string to an object.
   *
   * @private
   * @param {string} value
   * @returns {*}
   */
  _decodeValue(value) {
    return JSON.parse(value)
  }

  /**
   * Converts an object to a JSON string.
   *
   * @private
   * @param {*} value
   * @returns {string}
   */
  _encodeValue(value) {
    return JSON.stringify(value)
  }
}

module.exports = Redis
