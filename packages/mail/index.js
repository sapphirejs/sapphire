const Mail = require('./lib/mail')
const MailSendingFailed = require('./lib/errors/mail-sending-failed')
const MissingMailParams = require('./lib/errors/missing-mail-params')
const BadMailTransport = require('./lib/errors/bad-mail-transport')
const SMTP = require('./lib/transports/smtp')
const SES = require('./lib/transports/ses')

module.exports = {
  Mail,
  MailSendingFailed,
  MissingMailParams,
  BadMailTransport,
  Transport: {
    SMTP: SMTP,
    SES: SES
  }
}
