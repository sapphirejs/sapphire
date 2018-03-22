class ExpressConsumerInvalidArgument extends Error {
  constructor(message, code = null) {
    super(message, code)
    Error.captureStackTrace(this, ExpressConsumerInvalidArgument)
    this.code = code
  }
}

module.exports = ExpressConsumerInvalidArgument
