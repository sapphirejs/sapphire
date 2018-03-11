const Config = require('./config')

module.exports = container => {
  container.singleton(Config, () => {
    return new Config()
  })
}
