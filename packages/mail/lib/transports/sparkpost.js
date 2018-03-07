const nodemailer = require('nodemailer')

/**
 * Sparkpost Transport.
 *
 * @class Sparkpost
*/
class Sparkpost {
  /**
   * Sends the message.
   *
   * @public
   * @param {Object} config
   * @param {Object} message
   * @returns {Prommise}
   */
  send(config, message) {
    // @TODO implement Sparkpost Transport
  }
}

module.exports = Sparkpost
