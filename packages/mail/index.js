const Mail = require('./lib/mail')
const Message = require('./lib/Message')
const MailSendingFailed = require('./lib/errors/mail-sending-failed')
const MissingMailParams = require('./lib/errors/missing-mail-params')
const SmtpTransport = require('./lib/transports/smtp')
const SesTransport = require('./lib/transports/ses')

module.exports = {
  Mail,
  Message,
  MailSendingFailed,
  MissingMailParams,
  Transport: {
    SMTP: SmtpTransport,
    SES: SesTransport
  }
}
