const nodemailer = require('nodemailer')
const MailSendingFailed = require('./errors/MailSendingFailed')
const MissingMailParams = require('./errors/MissingMailParams')

/**
 * Mail class.
 * Builds and sens email messages.
*/
class Mail {
  constructor(config, mailer = null) {
    this._config = config
    this._mailer = mailer || nodemailer
    this._message = {
      from: this._config.from || null,
      to: [],
      cc: [],
      bcc: [],
      attachments: [],
      headers: {},
      alternatives: []
    }
  }

  /**
   * Priority constants.
   * @returns {Object}
   */
  static get priority() {
    return {
      high: 'high',
      normal: 'normal',
      low: 'low'
    }
  }

  /**
   * "from" header.
   * @param {*} args - Email or name, email.
   * @returns {Mail}
   */
  from(...args) {
    if (args && args.length) this._message.from = this._addressFromArgs(args)
    return this
  }

  /**
   * "from" header.
   * @param {*} args - Email or name, email.
   * @returns {Mail}
   */
  replyTo(...args) {
    if (args && args.length) this._message.replyTo = this._addressFromArgs(args)
    return this
  }

  /**
   * "to" header.
   * @param {*} args - Email or name, email.
   * @returns {Mail}
   */
  to(...args) {
    if (args && args.length) this._message.to.push(this._addressFromArgs(args))
    return this
  }

  /**
   * "cc" header.
   * @param {*} args - Email or name, email.
   * @returns {Mail}
   */
  cc(...args) {
    if (args && args.length) this._message.cc.push(this._addressFromArgs(args))
    return this
  }

  /**
   * "bcc" header.
   * @param {*} args - Email or name, email.
   * @returns {Mail}
   */
  bcc(...args) {
    if (args && args.length) this._message.bcc.push(this._addressFromArgs(args))
    return this
  }

  /**
   * "subject" header.
   * @param {string} subject
   * @returns {Mail}
   */
  subject(subject) {
    this._message.subject = subject
    return this
  }

   /**
   * Text body.
   * @param {string} text
   * @returns {Mail}
   */
  text(text) {
    this._message.text = text
    return this
  }

   /**
   * HTML body.
   * @param {string} html
   * @returns {Mail}
   */
  html(html) {
    this._message.html = html
    return this
  }

  /**
   * Attachments.
   * @param {Object} data
   * @returns {Mail}
   */
  attachment(data) {
    this._message.attachments.push(data)
    return this
  }

  /**
   * Custom header.
   * @param {string} name
   * @param {string} value
   * @param {boolean} prepared
   * @returns {Mail}
   */
  header(name, value, prepared = false) {
    this._message.headers[name] = { value, prepared }
    return this
  }

  /**
   * HTML body.
   * @param {string} type - Content type
   * @param {string} content
   * @returns {Mail}
   */
  alternatives(type, content) {
    this._message.alternatives.push({
      contentType: type,
      content
    })
    return this
  }

  /**
   * Email priority.
   * @param {string} priority - high, medium or low
   * @returns {Mail}
   */
  priority(priority) {
    this._message.priority = priority
    return this
  }

  /**
   * Send the email.
   * @param {string} content
   * @returns {Mail}
   * @throws {MissingMailParams} Email headers incomplete
   * @throws {MailSendingFailed} Fail to send email
   */
  send() {
    this._validateMessage()

    let transport = this._mailer.createTransport(this._config)
    transport.sendMail(this._message, (err) => {
      if (err)
        throw new MailSendingFailed(`Failed to send mail. System response: ${err.message}`)
    })
  }

  /**
   * Get either an email or name, email combination.
   * @param {string[]} args
   * @returns {string|Object}
   */
  _addressFromArgs(args) {
    if (!args || args.length == 0) return null

    return args.length == 1
      ? args[0]
      : { name: args[0], address: args[1] }
  }

  /**
   * Validate message headers,
   * @throws {MissingMailParams}
   */
  _validateMessage() {
    let message = this._message

    if (!message.from)
      throw new MissingMailParams(`Missing "from" parameter. Either set it as a config option with key "from" or call the from() function.`)

    if (!message.to.length)
      throw new MissingMailParams(`Missing "to" parameter. Set it with the to() function.`)

    if (!message.text && !message.html)
      throw new MissingMailParams(`Missing mail message. Set it with the text() or html() functions.`)
  }
}

module.exports = Mail
