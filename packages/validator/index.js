const Validator = require('./lib/validator')
const Middleware = require('./lib/middleware')
const ValidationError = require('./lib/errors/validation-error')
const Joi = require('joi')

module.exports = {
  rule: Joi,
  Validator,
  ValidatorMiddleware: Middleware,
  ValidationError
}
