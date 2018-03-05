const nodemailer = require('nodemailer')

/**
 * SMTP Transport.
 * 
 * @package sapphirejs/mail
*/
class SmtpTransport {
  /**
   * Sends the message.
   * 
   * @param {Object} config 
   * @param {Object} message
   * @returns {Prommise} 
   */
  send(config, message) {
    let transport = nodemailer.createTransport(config)
    return transport.sendMail(message)
  }
}

module.exports = SmtpTransport