const winston = require('winston')
require('winston-daily-rotate-file')

/**
 * Daily file rotate transport.
 * 
 * @class Daily
 */
class Daily {
  /**
   * @param {Object} config 
   */
  constructor(config) {
    return new winston.transports.DailyRotateFile({
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

module.exports = Daily