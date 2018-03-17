const bcrypt = require('bcrypt')

/**
 * Bcrypt hashing.
 *
 * @class Bcrypt
 */
class Bcrypt {
  /**
   * @param {Object} options
   */
  constructor(options = {}) {
    this._options = {
      ...{ rounds: 12 },
      ...options
    }
  }

  /**
   * Hashes a plaintext.
   *
   * @public
   * @param {string} plain
   * @returns {string}
   */
  generate(plain) {
    return bcrypt.hash(plain, this._options.rounds)
  }

  /**
   * Compares a plaintext to a hash.
   *
   * @param {string} plain
   * @param {string} hash
   * @returns {boolean}
   */
  compare(plain, hash) {
    return bcrypt.compare(plain, hash)
  }
}

module.exports = Bcrypt
