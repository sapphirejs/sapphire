class ExpressResponseConsumer {
  constructor(expressResponse, response) {
    this.__expressResponse = expressResponse
    this.__response = response
  }

  send() {
    console.log(this.__response)
    this.__expressResponse.json({ route: '/some-group/lol' })
  }
}

module.exports = ExpressResponseConsumer
