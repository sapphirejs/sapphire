# Sapphire Validator

A fluent email sender built as a thin wrapper on top of [nodemailer](https://github.com/nodemailer/nodemailer). It handles almost everything nodemailer does, but presents them in a more intuitive package. Actually supports STMP transport only, with plans to provide more in the future.

## Usage

We'll start with an exhaustive example that includes pretty much every option.

```javascript
const Mail = require('@sapphirejs/mail')

let config = {/* nodemailer configuration */}
let mail = new Mail(config)
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
  .send()
```

### Global "from" Header

When the "from" header is passed in the config, it will be automatically included in every mail instance. Off course it also be overriden with the `from` function.

```javascript
let config = { from: 'from@domain.com', /* other config options */ }
```

### Name, Email Format

The `from`, `replyTo`, `to`, `cc`, and `bcc` headers can be set with a name followed by the email.

```javascript
mail.from('John Smith', 'from@domain.com')
    .to('Jane Smith', 'to@domain.com')

// or as a single parameter

mail.from('John Smith<from@domain.com>')
    .to('Jane Smith<to@domain.com>')
```

### Multiple Parameters

Multiple receivers, either `to`, `cc`, or `bcc`, can be chained to add more than one.

```javascript
mail.to('John Smith<from@domain.com>')
    .to('Jane Smith<to@domain.com>')
```

The same applies to `header`, `attachment`, and `alternative`.

### Error Handling

Mail will throw a `MailSendingFailed` if sending fails, and `MissingMailParams` when the message headers aren't set correctly (ie: missing from field).

```javascript
try {
  /* other parameters omited for brevity */
  mail.send()
} catch(err) {
  /* handle errors */
}
```
