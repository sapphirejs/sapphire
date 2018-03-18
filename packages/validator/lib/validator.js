const Joi = require('joi')

/**
 * Validator class.
 * Validates the set of rules and builds an
 * error object
 *
 * @class Validator
*/
class Validator {
  /**
   * @param {Object} fields
   * @param {Object} schema
   */
  constructor(fields, schema) {
    const { error } = Joi.validate(fields, schema, { abortEarly: false })
    this._errors = {}
    this._prepareErrors(error)
  }

  /**
   * Transfors Joi's error object into a
   * simplified form.
   *
   * @private
   * @param {Error} error
   */
  _prepareErrors(error) {
    if (!error) return

    error.details.forEach(({ path, message }) => {
      const field = path[0]

      this._errors.hasOwnProperty(field)
        ? this._errors[field].push(message)
        : this._errors[field] = [message]
    })
  }

  /**
   * Check if validation passes.
   *
   * @public
   * @returns {boolean}
   */
  get passes() {
    return Object.keys(this._errors).length === 0
  }

  /**
   * Check if validation failed.
   *
   * @public
   * @returns {boolean}
   */
  get fails() {
    return !!Object.keys(this._errors).length
  }

  /**
   * Get the error messages.
   *
   * @public
   * @returns {Object}
   */
  get errors() {
    return this._errors
  }
}

module.exports = Validator
