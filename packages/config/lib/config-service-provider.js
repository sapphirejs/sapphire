const Config = require('./config')

module.exports = ioc => ioc.singleton(Config, () => new Config('config'))
