const Mail = require('./lib/mail')
const MailSendingFailed = require('./lib/errors/mail-sending-failed')
const MissingMailParams = require('./lib/errors/missing-mail-params')

module.exports = {
  Mail,
  MailSendingFailed,
  MissingMailParams
}
