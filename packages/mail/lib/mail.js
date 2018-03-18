const Message = require('./message')
const MailSendingFailed = require('./errors/mail-sending-failed')
const MissingMailParams = require('./errors/missing-mail-params')
const BadMailTransport = require('./errors/bad-mail-transport')

/**
 * Mail class.
 * Sends email messages.
 *
 * @class Mail
*/
class Mail {
  /**
   * @param {Object} config
   * @param {Object} transport
   * @throws {BadMailTransport} if transport is not a valid object
   */
  constructor(config, transport) {
    if (!transport || typeof transport !== 'object')
      throw new BadMailTransport('Use a valid Mail transport.')

    this._config = config
    this._transport = transport
  }

  /**
   * Send the email.
   *
   * @public
   * @param {string} content
   * @returns {Mail}
   * @throws {MissingMailParams} Email headers incomplete
   * @throws {MailSendingFailed} Fail to send email
   */
  async send(body, cb) {
    const params = typeof cb === 'function' ? cb(new Message()).message : {}
    const message = this._mergeDefaults(params)
    const messageWithBody = this._addBody(message, body)

    let { err } = this._validateMessage(messageWithBody)
    if (err) throw new MissingMailParams(err)

    return this._transport.send(this._config, messageWithBody)
      .then((info) => {
        return info
      })
      .catch((err) => {
        throw new MailSendingFailed(`Failed to send mail. System response: ${err.message}`)
      })
  }

  /**
   * Add body parameters to the message.
   *
   * @private
   * @param {Object} message
   * @param {string|Object} body
   * @returns {Object}
   */
  _addBody(message, body) {
    const messageWithBody = { ...message }

    body === Object(body)
      ? Object.assign(messageWithBody, { html: body.html, text: body.text })
      : messageWithBody.html = body

    return messageWithBody
  }

  /**
   * Add some sensible defaults to the message
   * from the config.
   *
   * @private
   * @param {Object} message
   * @returns {Object}
   */
  _mergeDefaults(params) {
    const message = { ...params }

    if (!message.from && this._config.from)
      message.from = this._config.from

    if (!message.replyTo && message.from)
      message.replyTo = message.from

    return message
  }

  /**
   * Validate message headers.
   *
   * @private
   * @param {Object} message
   * @returns {Object}
   */
  _validateMessage(message) {
    if (!message.from)
      return { err: `Missing 'from' parameter. Either set it as a config option with key 'from' or call the from() function.` }

    if (!message.to.length)
      return { err: `Missing 'to' parameter. Set it with the to() function.` }

    if (!message.text && !message.html)
      return { err: `Missing mail message. Set it with the text() or html() functions.` }

    return { err: null }
  }
}

module.exports = Mail
