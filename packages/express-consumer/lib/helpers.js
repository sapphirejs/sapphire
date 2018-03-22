module.exports = {
  /**
   *
   * @param object {object}
   * @param method {string}
   * @returns {boolean}
   */
  objectHasMethod: (object, method) =>
    Object.getOwnPropertyNames(
      Object.getPrototypeOf(object)
    ).filter( key => key === method ).length === 1
}
