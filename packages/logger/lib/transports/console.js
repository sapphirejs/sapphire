const winston = require('winston')

/**
 * Console transport.
 * 
 * @class Console
 */
class Console {
  /**
   * @param {Object} config 
   */
  constructor(config) {
    return new winston.transports.Console({
      timestamp: true,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf((info) => {
          return `[${info.timestamp}] ${info.level}: ${JSON.stringify(info.message)}`
        })
      )
      , ...config || {}
    })
  }
}

module.exports = Console