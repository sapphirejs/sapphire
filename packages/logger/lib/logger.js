const winston = require('winston')

/**
 * Logger as a thin interface to Winston.
 * 
 * @class Logger
 */
class Logger {
  /**
   * @param {Object} config 
   * @param {Object} transport 
   */
  constructor(config, transport) {
    this._config = config
    this._transport = transport
    this._level = 'debug'
    // Levels according to the Syslog Protocol, starting
    // from the most severe to the least.
    // http://www.rfc-base.org/txt/rfc-5424.txt
    this._levels = {
      emerg: 0,
      alert: 1,
      crit: 2,
      error: 3,
      warning: 4,
      notice: 5,
      info: 6,
      debug: 7
    }
  }

  /**
   * Creates the winston logger instance.
   * 
   * @public
   * @returns {Object}
   */
  createLogger() {
    return winston.createLogger({
      level: this._config && this._config.level || this._level,
      levels: this._levels,
      transports: [
        this._transport
      ]
    })
  }
}

module.exports = Logger
