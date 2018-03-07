const nodemailer = require('nodemailer')

/**
 * Mandrill Transport.
 *
 * @package sapphirejs/mail
*/
class Mandrill {
  /**
   * Sends the message.
   *
   * @param {Object} config
   * @param {Object} message
   * @returns {Prommise}
   */
  send(config, message) {
    // @TODO implement Mandrill Transport
  }
}

module.exports = Mandrill
