class ExampleMiddleware {
  constructor(something) {
    this.__data = something
  }

  handle({ Request, Response }, next) {
    console.log("Hey you, from middleware, " + this.__data)
    next()
  }
}

module.exports = ExampleMiddleware
