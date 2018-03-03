const Config = require('./Config')

module.exports = ioc => ioc.singleton(Config, () => new Config('config'))
