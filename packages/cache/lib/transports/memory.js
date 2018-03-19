/**
 * Memory cache transport.
 *
 * @class Redis
 */
class Memory {
  constructor() {
    this._store = {}
  }

  /**
   * Gets the value of a key.
   *
   * @public
   * @param {string} key
   * @returns {*}
   */
  get(key) {
    return this._store[key] || null
  }

  /**
   * Sets the value of a key.
   *
   * @public
   * @param {string} key
   * @param {*} value
   */
  set(key, value) {
    this._store[key] = value
  }

  /**
   * Increment a key by amount.
   *
   * @public
   * @param {string} key
   * @param {int} amount
   * @returns {*}
   */
  increment(key, amount) {
    if (!this._store[key])
      return null

    this._store[key] += amount
    return this._store[key]
  }

  /**
   * Decrement a key by amount.
   *
   * @public
   * @param {string} key
   * @param {int} amount
   * @returns {*}
   */
  decrement(key, amount) {
    if (!this._store[key])
      return null

    this._store[key] -= amount
    return this._store[key]
  }

  /**
   * Checks if a key exists.
   *
   * @public
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return !!this._store[key]
  }

  /**
   * Deletes a key.
   *
   * @public
   * @param {string} key
   * @returns {int}
   */
  delete(key) {
    if (!this._store[key])
      return 0

    delete this._store[key]
    return 1
  }

  /**
   * Deletes all the keys in the database.
   *
   * @public
   */
  flush() {
    this._store = {}
  }
}

module.exports = Memory
