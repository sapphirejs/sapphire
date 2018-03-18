const { Mail, MailSendingFailed, MissingMailParams, BadMailTransport } = require('../index')
const Message = require('../lib/message')

class MockTransport {
  constructor(shouldErr = false) {
    this._shouldErr = shouldErr
  }

  send(config, message) {
    return new Promise((resolve, reject) => {
      if (this._shouldErr) reject('error')
      // Transport isn't supposed to return the message
      // object, but a mail result. Doing this only for
      // testing purposes.
      resolve(message)
    })
  }
}

describe('message', () => {
  test('builds all headers', () => {
    const message = new Message()
    message.from('from@domain.com')
      .replyTo('from@domain.com')
      .to('to@domain.com')
      .cc('cc@domain.com')
      .bcc('bcc@domain.com')
      .subject('Testing')
      .attach({ filename: 'file.txt', content: 'File' })
      .header('my-key', '123')
      .alternative('text/x-web-markdown', '**Email body**')
      .priority('low')

    expect(message.message).toEqual({
      from: 'from@domain.com',
      replyTo: 'from@domain.com',
      to: ['to@domain.com'],
      cc: ['cc@domain.com'],
      bcc: ['bcc@domain.com'],
      subject: 'Testing',
      attachments: [{ filename: 'file.txt', content: 'File' }],
      headers: { 'my-key': { value: '123', prepared: false } },
      alternatives: [{ contentType: 'text/x-web-markdown', content: '**Email body**' }],
      priority: 'low'
    })
  })

  test('supports multiple receivers', () => {
    const message = new Message()
    message.to('one@domain.com').to('two@domain.com')

    expect(message.message.to).toEqual(['one@domain.com', 'two@domain.com'])
  })

  test('supports name and email combination in receiver', () => {
    const message = new Message()
    message.to('John Smith', 'js@domain.com')

    expect(message.message.to).toEqual([{
      name: 'John Smith',
      address: 'js@domain.com'
    }])
  })
})

describe('mail', () => {
  test("sets 'from' and 'replyTo' headers from config", async () => {
    expect.assertions(1)

    const mail = new Mail({ from: 'from@domain.com' }, new MockTransport())
    const sent = mail.send('hello', (message) => message.to('to@domain.com'))
    await expect(sent)
      .resolves
      .toMatchObject({
        from: 'from@domain.com',
        replyTo: 'from@domain.com'
      })
  })

  test("sets html body", async () => {
    expect.assertions(1)

    const mail = new Mail({}, new MockTransport())
    const sent = mail.send('hello', (message) => message.from('from@domain.com').to('to@domain.com'))
    await expect(sent)
      .resolves
      .toMatchObject({
        html: 'hello'
      })
  })

  test("sets html and text body", async () => {
    expect.assertions(1)

    const mail = new Mail({}, new MockTransport())
    const sent = mail.send({ html: '<p>Hello</p>', text: 'Hello' }, (message) => message.from('from@domain.com').to('to@domain.com'))
    await expect(sent)
      .resolves
      .toMatchObject({
        html: '<p>Hello</p>',
        text: 'Hello'
      })
  })

  test('throws when transport is not provided', () => {
    expect(() => {
      new Mail({})
    }).toThrow(BadMailTransport)
  })

  test('throws when callback in send() is missing', async () => {
    expect.assertions(1)

    try {
      const mail = new Mail({}, new MockTransport())
      await mail.send('hello')
    } catch (err) {
      expect(err).toBeInstanceOf(MissingMailParams)
    }
  })

  test('throws when callback in send() is not a valid function', async () => {
    expect.assertions(1)

    try {
      const mail = new Mail({}, new MockTransport())
      await mail.send('hello', 'not.a.function')
    } catch (err) {
      expect(err).toBeInstanceOf(MissingMailParams)
    }
  })

  test('throws when "from" header is missing', async () => {
    expect.assertions(1)

    try {
      const mail = new Mail({}, new MockTransport())
      await mail.send('hello', (message) => message.to('to@domain.com'))
    } catch (err) {
      expect(err).toBeInstanceOf(MissingMailParams)
    }
  })

  test('throws when "to" header is missing', async () => {
    expect.assertions(1)

    try {
      const mail = new Mail({}, new MockTransport())
      await mail.send('hello', (message) => message.from('from@domain.com'))
    } catch (err) {
      expect(err).toBeInstanceOf(MissingMailParams)
    }
  })

  test('throws when mail sending fails', async () => {
    expect.assertions(1)

    try {
      const mail = new Mail({}, new MockTransport(true))
      await mail.send('hello', (message) => message.from('from@domain.com').to('to@domain.com'))
    } catch (err) {
      expect(err).toBeInstanceOf(MailSendingFailed)
    }
  })
})
