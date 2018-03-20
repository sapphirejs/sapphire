const nodemailer = require('nodemailer')
const aws = require('aws-sdk')

/**
 * SMTP Transport.
 *
 * @class SES
*/
class SES {
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
   * @param {Object} config
   * @param {Object} message
   * @returns {Prommise}
   */
  send(message) {
    const transport = nodemailer.createTransport({
      SES: new aws.SES(this._config)
    })
    return transport.sendMail(message)
  }
}

module.exports = SES
