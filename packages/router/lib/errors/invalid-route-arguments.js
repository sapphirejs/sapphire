class InvalidRouteArguments extends Error {
  constructor(message, code = null) {
    super(message, code)
    Error.captureStackTrace(this, InvalidRouteArguments)
    this.code = code
  }
}

module.exports = InvalidRouteArguments
