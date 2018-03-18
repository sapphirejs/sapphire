# Mail

A fluent email sender built as a thin wrapper on top of [nodemailer](https://github.com/nodemailer/nodemailer). It handles almost everything nodemailer does, but presents them in a more intuitive package. Actually supports STMP and SES transports, with plans to provide more in the future.

## Usage

We'll start with an exhaustive example that includes pretty much every option.

```javascript
const { Mail, Transport } = require('@sapphirejs/mail')

const config = {/* nodemailer configuration */}
const mail = new Mail(config, new Transport.SMTP())
await mail.send('<p>Hi</p>', message => {
  message
    .from('from@domain.com')
    .replyTo('from@domain.com')
    .to('to@domain.com')
    .cc('cc@domain.com')
    .bcc('bcc@domain.com')
    .subject('Testing')
    .attach({ filename: 'file.txt', content: 'File' })
    .header('my-key', '123')
    .alternative('text/x-web-markdown', '**Email body**')
    .priority('low')
})
```

### HTML and Text Body

The first parameter of `Mail.send()` can be either a string as the HTML body, or an object that may set both the `text` and `html` versions. It is a good practice to include them both.

```javascript
await mail.send({ html: '<p>Hi</p>', text: 'Hi' }, /* rest of the message */)
```

### Global "from" Header

When the "from" header is passed in the config, it will be automatically included in every mail instance. Off course it also be overriden with the `from` function.

```javascript
let config = { from: 'from@domain.com', /* other config options */ }
```

### Name, Email Format

The `from`, `replyTo`, `to`, `cc`, and `bcc` headers can be set with a name followed by the email.

```javascript
message
  .from('John Smith', 'from@domain.com')
  .to('Jane Smith', 'to@domain.com')

// or as a single parameter

message
  .from('John Smith <from@domain.com>')
  .to('Jane Smith <to@domain.com>')
```

### Multiple Parameters

Multiple receivers, either `to`, `cc`, or `bcc`, can be chained to add more than one.

```javascript
message
  .to('John Smith<from@domain.com>')
  .to('Jane Smith<to@domain.com>')
```

The same applies to `header`, `attachment`, and `alternative`.

### Async

`Mail.send()` is an `async` function that returns a Promise and can be set to `await`. It will throw a `MailSendingFailed` if sending fails, or a `MissingMailParams` when the message headers aren't set correctly (ie: missing from field). Otherwise, it will return an info object with the details of the transport.

```javascript
try {
  const mail = new Mail(config, new Transport.SMTP())
  const result = await mail
    .send('<p>Hello</p>', message => {
      message
        .from('from@domain.com')
        .to('to@domain.com')
        .subject('Testing')
    })
} catch(err) {
  // handle the error
}
```

### SMTP Transport

The `SMTP` transport requires a configuration containing the server connection and authentication parameters. Most email services provide STMP options, so it should be a common transport for most use cases. A basic configuration is provided below, but you can read the [nodemailer docs](https://nodemailer.com/smtp/) for more advanced options like pooled connections, certificates, etc.

```javascript
const config = {
  host: 'smtp.thehost.com',
  port: 465,
  secure: false,
  auth: {
    user: 'user',
    pass: 'pass'
  }
}

const mail = new Mail(config, new Transport.SMTP())
```

### SES Transport

The `SES` transport connects to the SES API, a very reliable and affordable mail service. Please refer to the [AWS SDK docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html) for a list of configuration options, especially those in the section "Constructor Details".

```javascript
const config = {{
  accessKeyId: 'ACCESS_KEY',
  secretAccessKey: 'SECRET_KEY',
  region: 'us-east-1'
}

const mail = new Mail(config, new Transport.SES())
```
