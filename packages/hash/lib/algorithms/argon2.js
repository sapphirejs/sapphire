const argon = require('argon2')

/**
 * Argon2 hashing.
 *
 * @class Argon2
 */
class Argon2 {
  /**
   * @param {Object} options
   */
  constructor(options = {}) {
    this._options = options
  }

  /**
   * Hashes a plaintext.
   *
   * @public
   * @param {string} plain
   * @returns {string}
   */
  generate(plain) {
    return argon.hash(plain, this._options)
  }

  /**
   * Compares a plaintext to a hash.
   *
   * @param {string} plain
   * @param {string} hash
   * @returns {boolean}
   */
  compare(plain, hash) {
    return argon.verify(hash, plain)
  }
}

module.exports = Argon2
