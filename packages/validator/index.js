const Validator = require('./lib/Validator')
const Middleware = require('./lib/Middleware')
const Joi = require('joi')

module.exports = {
  rule: Joi,
  Validator,
  ValidatorMiddleware: Middleware
}
