const nodemailer = require('nodemailer')

/**
 * SMTP Transport.
 *
 * @class SMTP
*/
class SMTP {
  /**
   * Sends the message.
   *
   * @public
   * @param {Object} config
   * @param {Object} message
   * @returns {Prommise}
   */
  send(config, message) {
    let transport = nodemailer.createTransport(config)
    return transport.sendMail(message)
  }
}

module.exports = SMTP
