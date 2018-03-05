const nodemailer = require('nodemailer')
const aws = require('aws-sdk')

/**
 * SMTP Transport.
 * 
 * @package sapphirejs/mail
*/
class SesTransport {
  /**
   * Sends the message.
   * 
   * @param {Object} config 
   * @param {Object} message
   * @returns {Prommise} 
   */
  send(config, message) {
    let transport = nodemailer.createTransport({
      SES: new aws.SES(config)
    })
    return transport.sendMail(message)
  }
}

module.exports = SesTransport