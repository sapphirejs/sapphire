const Joi = require('joi')

/**
 * Validator class.
 * Validates the set of rules and builds an
 * error object
 *
 * @module sapphirejs/validator
*/
class Validator {
  /**
   * @param {Object} fields
   * @param {Object} schema
   */
  constructor(fields, schema) {
    let { error } = Joi.validate(fields, schema, { abortEarly: false })
    this._errors = {}
    this._prepareErrors(error)
  }

  /**
   * Transfors Joi's error object into a
   * simplified form.
   *
   * @param {Error} error
   */
  _prepareErrors(error) {
    if (!error) return

    error.details.forEach(({ path, message }) => {
      let field = path[0]

      this._errors.hasOwnProperty(field)
        ? this._errors[field].push(message)
        : this._errors[field] = [message]
    })
  }

  /**
   * Check if validation passes.
   *
   * @returns {boolean}
   */
  get passes() {
    return !Object.keys(this._errors).length
  }

  /**
   * Check if validation failed.
   *
   * @returns {boolean}
   */
  get fails() {
    return !!Object.keys(this._errors).length
  }

  /**
   * Get the error messages.
   *
   * @returns {Object}
   */
  get errors() {
    return this._errors
  }
}

module.exports = Validator
