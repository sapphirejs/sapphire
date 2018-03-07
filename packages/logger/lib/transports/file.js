const winston = require('winston')

/**
 * File transport.
 * 
 * @class File
 */
class File {
  /**
   * @param {Object} config 
   */
  constructor(config) {
    return new winston.transports.File({
      timestamp: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf((info) => {
          return `[${info.timestamp}] ${info.level}: ${JSON.stringify(info.message)}`
        })
      )
      , ...config || {}
    })
  }
}

module.exports = File