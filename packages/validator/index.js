const Validator = require('./lib/validator')
const Middleware = require('./lib/middleware')
const Joi = require('joi')

module.exports = {
  rule: Joi,
  Validator,
  ValidatorMiddleware: Middleware
}
