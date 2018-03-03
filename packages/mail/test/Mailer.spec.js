const { Mail, MailSendingFailed, MissingMailParams } = require('../index')

test('builds all headers', () => {
  let mail = new Mail({})
  mail.from('from@domain.com')
    .replyTo('from@domain.com')
    .to('to@domain.com')
    .cc('cc@domain.com')
    .bcc('bcc@domain.com')
    .subject('Testing')
    .text('Email body')
    .html('<p>Email body</p>')
    .attachment({ filename: 'file.txt', content: 'File' })
    .header('my-key', '123')
    .alternatives('text/x-web-markdown', '**Email body**')
    .priority(Mail.priority.low)

  expect(mail._message).toEqual({
    from: 'from@domain.com',
    replyTo: 'from@domain.com',
    to: ['to@domain.com'],
    cc: ['cc@domain.com'],
    bcc: ['bcc@domain.com'],
    subject: 'Testing',
    text: 'Email body',
    html: '<p>Email body</p>',
    attachments: [{ filename: 'file.txt', content: 'File' }],
    headers: { 'my-key': { value: '123', prepared: false } },
    alternatives: [{ contentType: 'text/x-web-markdown', content: '**Email body**' }],
    priority: 'low'
  })
})

test('supports multiple receivers', () => {
  let mail = new Mail({})
  mail.to('one@domain.com').to('two@domain.com')

  expect(mail._message.to).toEqual(['one@domain.com', 'two@domain.com'])
})

test('supports name and email combination in receiver', () => {
  let mail = new Mail({})
  mail.to('John Smith', 'js@domain.com')

  expect(mail._message.to).toEqual([{
    name: 'John Smith',
    address: 'js@domain.com'
  }])
})

test('sets "from" header from config', () => {
  let mail = new Mail({ from: 'from@domain.com' })

  expect(mail._message.from).toBe('from@domain.com')
})

test('throws when "from" header is missing', () => {
  let mail = new Mail({})
  mail.to('to@domain.com')
    .text('Email body')
    .html('<p>Email body</p>')

  expect(() => mail.send()).toThrow(MissingMailParams)
})

test('throws when "to" header is missing', () => {
  let mail = new Mail({})
  mail.from('from@domain.com')
    .text('Email body')
    .html('<p>Email body</p>')

  expect(() => mail.send()).toThrow(MissingMailParams)
})

test('throws when body is missing', () => {
  let mail = new Mail({})
  mail.from('from@domain.com')
    .to('to@domain.com')

  expect(() => mail.send()).toThrow(MissingMailParams)
})

test('throws when mail sending fails', () => {
  let mailer = {
    transport: {
      sendMail(message, callback) {
        callback(new Error())
      }
    },
    createTransport(config) {
      return this.transport
    }
  }
  let mail = new Mail({}, mailer)
  mail.from('from@domain.com')
    .to('to@domain.com')
    .text('Email body')
    .html('<p>Email body</p>')

  expect(() => mail.send()).toThrow(MailSendingFailed)
})

test("address from arguments returns null when empty", () => {
  let mail = new Mail({})
  expect(mail._addressFromArgs()).toBe(null)
  expect(mail._addressFromArgs([])).toBe(null)
})