const nodemailer = require('nodemailer')

/**
 * Mandrill Transport.
 *
 * @class Mandril
*/
class Mandrill {
  /**
   * Sends the message.
   *
   * @public
   * @param {Object} config
   * @param {Object} message
   * @returns {Prommise}
   */
  send(config, message) {
    // @TODO implement Mandrill Transport
  }
}

module.exports = Mandrill
