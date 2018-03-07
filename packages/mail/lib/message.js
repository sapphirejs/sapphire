/**
 * Message class.
 * Builds an email message.
 *
 * @class Message
*/
class Message {
  constructor() {
    this._message = {
      to: [],
      cc: [],
      bcc: [],
      attachments: [],
      headers: {},
      alternatives: []
    }
  }

  /**
   * Get the message object.
   *
   * @public
   * @returns {Object}
   */
  get message() {
    return this._message
  }

  /**
   * "from" header.
   *
   * @public
   * @param {*} args - Email or name, email.
   * @returns {Message}
   */
  from(...args) {
    this._addAddress('from', args)
    return this
  }

  /**
   * "replyTo" header.
   *
   * @public
   * @param {*} args - Email or name, email.
   * @returns {Message}
   */
  replyTo(...args) {
    this._addAddress('replyTo', args)
    return this
  }

  /**
   * "to" header.
   *
   * @public
   * @param {*} args - Email or name, email.
   * @returns {Message}
   */
  to(...args) {
    this._addAddress('to', args)
    return this
  }

  /**
   * "cc" header.
   *
   * @public
   * @param {*} args - Email or name, email.
   * @returns {Message}
   */
  cc(...args) {
    this._addAddress('cc', args)
    return this
  }

  /**
   * "bcc" header.
   *
   * @public
   * @param {*} args - Email or name, email.
   * @returns {Message}
   */
  bcc(...args) {
    this._addAddress('bcc', args)
    return this
  }

  /**
   * "subject" header.
   *
   * @public
   * @param {string} subject
   * @returns {Message}
   */
  subject(subject) {
    this._message.subject = subject
    return this
  }

  /**
   * Attach a file.
   *
   * @public
   * @param {Object} data
   * @returns {Message}
   */
  attach(data) {
    this._message.attachments.push(data)
    return this
  }

  /**
   * Custom header.
   *
   * @public
   * @param {string} name
   * @param {string} value
   * @param {boolean} prepared
   * @returns {Message}
   */
  header(name, value, prepared = false) {
    this._message.headers[name] = { value, prepared }
    return this
  }

  /**
   * Alternative body.
   *
   * @public
   * @param {string} type - Content type
   * @param {string} content
   * @returns {Message}
   */
  alternative(type, content) {
    this._message.alternatives.push({
      contentType: type,
      content
    })
    return this
  }

  /**
   * Email priority.
   *
   * @public
   * @param {string} priority - high, medium or low
   * @returns {Message}
   */
  priority(priority) {
    this._message.priority = priority
    return this
  }

  /**
   * Add an address supporting either an email
   * or (name, email) combination.
   *
   * @private
   * @param {string} key
   * @param {string[]} args
   */
  _addAddress(key, args) {
    if (!args || args.length == 0) return

    let value = args.length == 1
      ? args[0]
      : { name: args[0], address: args[1] }

    // Keys like 'from' don't have to be arrays,
    // while 'to', 'cc', etc, need to.
    Array.isArray(this._message[key])
      ? this._message[key].push(value)
      : this._message[key] = value
  }
}

module.exports = Message
