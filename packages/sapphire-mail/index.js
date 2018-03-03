const Mail = require('./lib/Mail')
const MailSendingFailed = require('./lib/errors/MailSendingFailed')
const MissingMailParams = require('./lib/errors/MissingMailParams')

module.exports = {
  Mail,
  MailSendingFailed,
  MissingMailParams
}