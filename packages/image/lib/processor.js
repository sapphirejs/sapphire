const sharp = require('sharp')

/**
 * Image processor.
 *
 * @class Processor
 */
class Processor {
  /**
   * @param {*} path
   */
  constructor(options) {
    this._image = sharp(options)
  }

  /**
   * Resizes an image by keeping aspect
   * ratio and not allowing to get larger
   * than its original size.
   *
   * @public
   * @param {int} width
   * @param {int} height
   * @returns {Processor}
   */
  resize(width, height) {
    this._image
      .resize(width, height)
      .withoutEnlargement(true)
    return this
  }

  /**
   * Resizes only the width of an image and
   * sets the height automatically.
   * Same as: resize(width, null)
   *
   * @public
   * @param {int} width
   * @returns {Processor}
   */
  widen(width) {
    return this.resize(width, null)
  }

  /**
   * Resizes only the height of an image and
   * sets the width automatically.
   * Same as: resize(null, height)
   *
   * @public
   * @param {int} height
   * @returns {Processor}
   */
  heighten(height) {
    return this.resize(null, height)
  }

  /**
   * Crops the image with one of the gravity
   * or strategy constants. Must be called
   * after resize().
   *
   * @public
   * @param {int} gravity
   * @returns {Processor}
   */
  crop(gravity = 0) {
    this._image.crop(gravity)
    return this
  }

  /**
   * Ignores aspect ratio. Must be called
   * after resize().
   *
   * @public
   * @returns {Processor}
   */
  ignoreRatio() {
    this._image.ignoreAspectRatio()
    return this
  }

  /**
   * Allows an image to be resized more than
   * its original size. Must be called after
   * resize().
   *
   * @public
   * @returns {Processor}
   */
  enlarge() {
    this._image.withoutEnlargement(false)
    return this
  }

  /**
   * Rotates the image to the given angle in
   * deegres. Angle must be a multiple of 90.
   * If omitted, EXIF data will be used if
   * present to automatically rotate the image.
   *
   * @public
   * @param {int} angle
   * @returns {Processor}
   */
  rotate(angle = null) {
    this._image.rotate(angle)
    return this
  }

  /**
   * Flips image in the X or Y axis.
   *
   * @public
   * @param {string} axis
   * @returns {Processor}
   */
  flip(axis = 1) {
    if (axis === 0)
      this._image.flop()
    else
      this._image.flip()

    return this
  }

  /**
   * Sharpens the image using a mild,
   * but fast algorithm.
   *
   * @public
   * @returns {Processor}
   */
  sharpen() {
    this._image.sharpen()
    return this
  }

  /**
   * Blurs the image. Without an amount,
   * it performs a mild, but fast blur.
   * Amount must be a number between
   * 0 and 100.
   *
   * @public
   * @param {float} amount
   * @returns {Processor}
   */
  blur(amount = null) {
    // Convert input 0-100 range to output
    // 0.3 - 1000 range accepted by sharp.
    const converted = amount
      ? amount / 100 * (1000 - 0.3) + 0.3
      : amount

    this._image.blur(converted)
    return this
  }

  /**
   * Extends the image filling the space
   * with the background() color.
   *
   * @public
   * @param {Object} extend
   * @returns {Processor}
   */
  extend(extend = {}) {
    const options = {
      ...{
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      },
      ...extend
    }

    this._image.extend(options)
    return this
  }

  /**
   * Merges the alpha transparency channel
   * with the background, if provided.
   *
   * @public
   * @returns {Processor}
   */
  flatten() {
    this._image.flatten()
    return this
  }

  /**
   * Applies gamma correction. Gamma must be
   * a number between 1.0 and 3.0.
   *
   * @public
   * @param {float} value
   * @returns {Processor}
   */
  gamma(value = 2.2) {
    this._image.gamma(value)
    return this
  }

  /**
   * Converts the image to its negative.
   *
   * @public
   * @returns {Processor}
   */
  negative() {
    this._image.negate()
    return this
  }

  /**
   * Enhances the image contrast.
   *
   * @public
   * @returns {Processor}
   */
  enhance() {
    this._image.normalize()
    return this
  }

  /**
   * Sets a background color. Useful when using
   * extend() or flatten().
   *
   * @public
   * @param {Object} color
   * @returns {Processor}
   */
  background(color = {}) {
    const options = { ...{ r: 0, g: 0, b: 0, alpha: 1 }, ...color }
    this._image.background(options)
    return this
  }

  /**
   * Converts the image to 8-bit grayscale,
   * 256 colors.
   *
   * @public
   * @returns {Processor}
   */
  grayscale() {
    this._image.grayscale()
    return this
  }

  /**
   * Adds an overlay image on top of the original
   * one. The overlay can be positioned using one
   * of the gravity constants, and the top and
   * left offsets.
   *
   * @public
   * @param {string} path
   * @param {Object} options
   * @returns {Processor}
   */
  overlay(path, options = { gravity: 0, top: 0, left: 0, tile: false }) {
    this._image.overlayWith(path, options)
    return this
  }

  /**
   * Image information.
   *
   * @public
   * @returns {Promise}
   */
  metadata() {
    return this._image.metadata()
  }

  /**
   * Exports to JPEG.
   *
   * @public
   * @param {string} path
   * @param {Object} options
   * @returns {Processor}
   */
  jpeg(path, options = { quality: 90, progressive: true }) {
    return this._image.jpeg(options).toFile(path)
  }

  /**
   * Exports to PNG.
   *
   * @public
   * @param {string} path
   * @param {Object} options
   * @returns {Processor}
   */
  png(path, options = { progressive: true }) {
    return this._image.jpeg(options).toFile(path)
  }

  /**
   * Exports to WebP.
   *
   * @public
   * @param {string} path
   * @param {Object} options
   * @returns {Processor}
   */
  webp(path, options = { quality: 90 }) {
    return this._image.jpeg(options).toFile(path)
  }

  /**
   * Exports to a file by inferring the format
   * from the extension.
   *
   * @public
   * @param {string} path
   * @param {Object} options
   * @returns {Processor}
   */
  save(path) {
    return this._image.toFile(path)
  }

  /**
   * Raw sharp instance.
   *
   * @returns {Object}
   */
  get raw() {
    return this._image
  }
}

module.exports = Processor
