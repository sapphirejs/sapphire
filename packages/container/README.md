# IOC Container

<p>
  <img src="https://david-dm.org/sapphire-framework/sapphire-ioc.svg" alt="Dependencies" />
  <img src="https://travis-ci.org/sapphire-framework/sapphire-ioc.svg?branch=master" alt="Build status" />
  <a href='https://coveralls.io/github/sapphire-framework/sapphire-ioc?branch=master'><img src='https://coveralls.io/repos/github/sapphire-framework/sapphire-ioc/badge.svg?branch=master' alt='Coverage Status' /></a>
</p>

An IOC (Inversion of Control) container used internally in Sapphire Framework to register and resolve practically every service exposed by the framework. A container is a great idea when your services need boostrapping, such as configuration or dependency injection. By registering them in the container is not only convenient, but makes them very easy to swap with a different implementation.

## Installation

```
$ npm install --save @sapphirejs/container
```

## Registering Services

You can register a service using the `register` method and passing a callback where you initialize that service. That callback may be a simple function or, more probably, a class instance. In the example below imagine you have a `Mail` class that you need to register in the container:

```js
class Mail {
  constructor(smtp) {
    // Imaginary connect() method.
    this.connection = connect(smtp)
  }

  send(to) {
    return this.connection.send(to)
  }
}

module.exports = Mail
```

Service registration should happen in a dedicated place, like a `MailServiceProvider`, but we're keeping it simple and ignoring that fact. We'll simply register it somewhere in our app:

```js
const Container = require('@sapphirejs/container')
const Mail = require('./Mail')

const container = new Container()
container.register(Mail, () => {
  return new Mail({ server: 'smtp.example.com' })
})
```

The `Mail` class is now registered by passing the class as the identifier. You could simply use "mail" or any other name, it wouldn't make much of a difference. Using a class name makes it less error prone though.

## Singleton Services

In exactly the same way as a normal service, you can register singletons. The main difference is that when resolving, the container will use the same instance again and again. This is useful when you need an object to keep its state during the lifecycle of an application, such as reading configuration or other expensive operations. In the example of the `Mail` class, it would be a perfect match for a singleton, as we need to connect to the SMTP server only once and keep the connection alive.

```js
const Container = require('@sapphirejs/container')
const Mail = require('./Mail')

const container = new Container()
container.singleton(Mail, () => {
  return new Mail({ server: 'smtp.example.com' })
})
```

## Resolving Services

Registered services need to be resolved, and that's exactly what the `resolve` method does. It checks the pool of services and either returns a new instance, or an existing one in case of a singleton.

```js
const Container = require('@sapphirejs/container')
const Mail = require('./Mail')

const container = new Container()
const mail = container.resolve(Mail)
mail.send('receiver@example.com')
```

As previously said, the identifier of the service can be anything. If it's too much of a hassle requiring the original module everytime you need to resolve it, you can always use a string:

```js
const Container = require('@sapphirejs/container')
const Mail = require('./Mail')

const container = new Container()
container.register("mail", () => {
  return new Mail({ server: 'smtp.example.com' })
})

// somewhere else in the application
const mail = container.resolve("mail")
mail.send('receiver@example.com')
```
