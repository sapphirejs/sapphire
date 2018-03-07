const Logger = require('./lib/logger')
const Console = require('./lib/transports/console')
const File = require('./lib/transports/file')
const Daily = require('./lib/transports/daily')

module.exports = {
  Logger,
  Transport: {
    Console,
    File,
    Daily
  }
}
