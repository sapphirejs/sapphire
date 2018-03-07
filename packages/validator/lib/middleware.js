const Validator = require('./validator')

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
   * Express middleware that runs the validator and
   * injects it as an instance.
   *
   * @public
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  middleware(req, res, next) {
    req.validator = new Validator(this.fields(req), this.rules())
    next()
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
