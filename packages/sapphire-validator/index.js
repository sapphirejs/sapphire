const Validator = require('./src/Validator')
const Middleware = require('./src/Middleware')
const Joi = require('joi')

module.exports = {
  rule: Joi,
  Validator,
  ValidatorMiddleware: Middleware
}
