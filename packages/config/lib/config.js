const objectPath = require('object-path')

/**
 * Reads configuration files.
 *
 * @class Config
 */
class Config {
  /**
   * @param {Object} config
   */
  constructor(config) {
    this._config = config
  }

  /**
   * Reads a key from config.
   *
   * @public
   * @param {string} key
   * @returns {*}
   */
  get(key = null, defaultValue = null) {
    if (!key)
      return defaultValue || null

    return objectPath.get(this._config, key) || defaultValue || null
  }

  /**
   * Checks if a key exists.
   *
   * @public
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return this.get(key) !== null
  }
}

module.exports = Config
