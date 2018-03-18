const Processor = require('./processor')
const MissingProcessor = require('./errors/missing-processor')

class Image {
  /**
   * Starts image manipulation with a path
   * to a system file.
   *
   * @param {string} path
   * @param {function} cb
   * @returns {Promise}
   * @throws {MissingProcessor} when callback is missing
   */
  open(path, cb) {
    if (!cb || typeof cb !== 'function')
      throw new MissingProcessor('Image expects a callback to process images.')

    const processor = new Processor(path)
    cb(processor)
    return processor.raw
  }

  /**
   * Creates an empty image.
   *
   * @param {Object} options
   * @param {function} cb
   * @returns {Promise}
   * @throws {MissingProcessor} when callback is missing
   */
  create(options, cb) {
    if (!cb || typeof cb !== 'function')
      throw new MissingProcessor('Image expects a callback to process images.')

    options = {
      ...options,
      ...{
        with: 100,
        height: 100,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 255 }
      }
    }

    const processor = new Processor({ create: options })
    cb(processor)
    return processor.raw
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
