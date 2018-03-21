const nodemailer = require('nodemailer')

/**
 * SMTP Transport.
 *
 * @class SMTP
*/
class SMTP {
  /**
   * @param {Object} config
   */
  constructor(config) {
    this._config = config
  }

  /**
   * Sends the message.
   *
   * @public
   * @param {Object} message
   * @returns {Prommise}
   */
  send(message) {
    const transport = nodemailer.createTransport(this._config)
    return transport.sendMail(message)
  }
}

module.exports = SMTP
