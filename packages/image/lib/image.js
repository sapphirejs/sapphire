const Processor = require('./processor')

class Image {
  /**
   * Starts image manipulation with a path
   * to a system file.
   * 
   * @param {string} path 
   * @param {function} cb 
   * @returns {Promise}
   */
  open(path, cb) {
    return cb(new Processor(path))
  }

  /**
   * Creates an empty image.
   * 
   * @param {Object} options 
   * @param {function} cb
   * @returns {Promise} 
   */
  create(options, cb) {
    options = {
      ...options,
      ...{
        with: 100,
        height: 100,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 255 }
      }
    }
    return cb(new Processor({ create: options }))
  }

  /**
   * Gravity constants.
   * 
   * @returns {Object}
   */
  static get gravity() {
    return {
      center: 0,
      north: 1,
      east: 2,
      south: 3,
      west: 4,
      northeast: 5,
      southeast: 6,
      southwest: 7,
      northwest: 8
    }
  }

  /**
   * Strategy constants.
   * 
   * @returns {Object}
   */
  static get strategy() {
    return {
      entropy: 16,
      attention: 17
    }
  }

  /**
   * Axis constants.
   * 
   * @returns {Object}
   */
  static get axis() {
    return {
      x: 0,
      y: 1
    }
  }
}

module.exports = Image