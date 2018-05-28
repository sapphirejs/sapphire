const Validator = require('./validator')
const ValidationError = require('./errors/validation-error')

/**
 * Middleware class.
 * Intercepts request parameters and validates them
 * by the rules of a subclass.
 *
 * @class Middleware
*/
class Middleware {
  constructor() {
    // The middleware() function will be passed to the
    // router, so it needs this class' this.
    this.middleware = this.middleware.bind(this)
  }

  /**
   * Express middleware that runs the validator throws if
   * it fails.
   *
   * @public
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  middleware(req, res, next) {
    const validator = new Validator(this.fields(req), this.rules())

    if (validator.fails) {
      throw new ValidationError(validator.errors)
    } else {
      next()
    }
  }

  /**
   * Builds the fields to be used for validation.
   *
   * @public
   * @param {Object} req
   * @returns {Object}
   */
  fields(req) {
    return {...req.body, ...req.query}
  }
}

module.exports = Middleware
