/**
 * Generates and compares hashes.
 *
 * @class Hash
 */
class Hash {
  /**
   * @param {Object} algorithm
   */
  constructor(algorithm) {
    this._algorithm = algorithm
  }

  /**
   * Hashes a plaintext.
   *
   * @public
   * @param {string} plain
   * @returns {string}
   */
  generate(word) {
    return this._algorithm.generate(word)
  }

  /**
   * Compares a plaintext to a hash.
   *
   * @param {string} plain
   * @param {string} hash
   * @returns {boolean}
   */
  compare(plain, hash) {
    return this._algorithm.compare(plain, hash)
  }
}

module.exports = Hash
