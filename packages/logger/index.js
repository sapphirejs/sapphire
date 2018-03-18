const Logger = require('./lib/logger')
const BadLoggerTransport = require('./lib/errors/bad-logger-transport.js')
const Console = require('./lib/transports/console')
const File = require('./lib/transports/file')
const Daily = require('./lib/transports/daily')

module.exports = {
  Logger,
  BadLoggerTransport,
  Transport: {
    Console,
    File,
    Daily
  }
}
