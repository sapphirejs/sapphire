const nodemailer = require('nodemailer')
const aws = require('aws-sdk')

/**
 * SMTP Transport.
 *
 * @class SES
*/
class SES {
  /**
   * Sends the message.
   *
   * @public
   * @param {Object} config
   * @param {Object} message
   * @returns {Prommise}
   */
  send(config, message) {
    const transport = nodemailer.createTransport({
      SES: new aws.SES(config)
    })
    return transport.sendMail(message)
  }
}

module.exports = SES
