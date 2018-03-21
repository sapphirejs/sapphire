const is = {
  /**
   * Check if the provided value is
   * a function.
   * 
   * @param {*} callback
   * @returns {boolean}
   */
  callback: (callback) => {
    return typeof callback === 'function'
  },

  /**
   * Check if it's an array of functions.
   * 
   * @param {*} array
   * @returns {boolean}
   */
  arrayOfFunctions: (array) => {
    if (!Array.isArray(array))
      return false

    return array.every(item => {
      return typeof item === 'function'
    })
  },

  /**
   * Check if it's a valid middleware.
   * 
   * @param {*} middleware
   * @returns {boolean}
   */
  middleware: function(middleware) {
    return typeof middleware === 'function' ||
      this.arrayOfFunctions(middleware)
  },
  
  /**
   * Checks if it's an object.
   * 
   * @param {*} object
   * @returns {boolean}
   */
  object: (object) => {
    return typeof object === 'object'
  }
}

module.exports = is