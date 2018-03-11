const fs = require('fs')
const path = require('path')
const objectPath = require('object-path')
const ConfigDirNotFound = require('./errors/config-dir-not-found')

/**
 * Reads configuration files.
 *
 * @class Config
 */
class Config {
  /**
   * @param {string} directory
   * @throws {ConfigDirNotFound} if the configuration directory doesn't exist
   */
  constructor(directory = '') {
    const configPath = path.join(process.cwd(), directory)

    if (!this._directoryExists(configPath))
      throw new ConfigDirNotFound(`Configuration directory "${directory}" doesn't exist.`)

    this._cache = {}
    this._folder = configPath

    // @TODO implement preloading.
  }

  /**
   * Reads a key from the file or cache.
   * Supports path syntax "file.key" where
   * the first parameter is always the filename.
   *
   * @public
   * @param {string} key
   * @returns {*}
   */
  get(key = null) {
    if (!key || typeof key !== 'string')
      return null

    const parts = key.split('.')
    // Hit the in-memory cache first.
    const cachedValue = objectPath.get(this._cache, parts)
    if (cachedValue) return cachedValue

    // require() will throw an expection
    // if the file doesn't exist. We just
    // need to return null, not throw errors.
    try {
      const file = parts[0]
      const contents = require(`${this._folder}/${file}`)
      const value = objectPath.get(contents, parts.slice(1))

      if (!value) return null

      this._addToCache(file, contents)

      return value
    }
    catch(err) {
      return null
    }
  }

  /**
   * Checks if a directory exists
   *
   * @private
   * @param {string} folder
   * @returns {boolean}
   */
  _directoryExists(folder) {
    try {
      fs.lstatSync(folder).isDirectory()
    } catch (err) {
      return false
    }

    return true
  }

  /**
   * Adds a key to the cache.
   *
   * @private
   * @param {string} key
   * @param {Object} value
   */
  _addToCache(key, value) {
    this._cache = {
      ...this._cache,
      [key]: value
    }
  }
}

module.exports = Config
