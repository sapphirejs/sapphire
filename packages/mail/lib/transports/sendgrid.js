const nodemailer = require('nodemailer')

/**
 * Sendgrid Transport.
 *
 * @package sapphirejs/mail
*/
class Sendgrid {
  /**
   * Sends the message.
   *
   * @param {Object} config
   * @param {Object} message
   * @returns {Prommise}
   */
  send(config, message) {
    // @TODO implement Sendgrid Transport
  }
}

module.exports = Sendgrid
