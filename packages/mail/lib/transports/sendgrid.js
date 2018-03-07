const nodemailer = require('nodemailer')

/**
 * Sendgrid Transport.
 *
 * @class Sendgrid
*/
class Sendgrid {
  /**
   * Sends the message.
   *
   * @public
   * @param {Object} config
   * @param {Object} message
   * @returns {Prommise}
   */
  send(config, message) {
    // @TODO implement Sendgrid Transport
  }
}

module.exports = Sendgrid
