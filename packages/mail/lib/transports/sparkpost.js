const nodemailer = require('nodemailer')

/**
 * Sparkpost Transport.
 * 
 * @package sapphirejs/mail
*/
class SparkpostTransport {
  /**
   * Sends the message.
   * 
   * @param {Object} config 
   * @param {Object} message
   * @returns {Prommise} 
   */
  send(config, message) {
    // @TODO implement Sparkpost Transport
  }
}

module.exports = SparkpostTransport