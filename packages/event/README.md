# Event

A thin wrapper for Node's native [events](https://nodejs.org/api/events.html). Mostly to offer a few abstractions, a base class to be extended by event classes, and generally a tighter integration with Sapphire Framework. Other than that, it doesn't have any logic of its own and can be completely ignored if you don't like even such thin abstractions.

## Usage

As you'd expect, events can be listened with `on` and emmited with `emit`.

```js
const { Event } = require('@sapphirejs/event')

const event = new Event()
event.on('some.event', () => {
  console.log('Yay, I was called')
})
event.emit('some.event')
```

More interesting though, are event classes as a way to organize and encapsulate event handlers.

```js
class SendWelcomeEmail {
  listen(userId) {
    // send email to user with id=userId
  }
}

event.on('user.registered', new SendWelcomeEmail().listen)
event.emit('user.registered', 10)
```

An event can have multiple listeners:

```js
event.on('user.registered', new SendWelcomeEmail().listen)
event.on('user.registered', new SendConfirmationSms().listen)

// or

event.on('user.registered', [
  new SendWelcomeEmail().listen,
  new SendConfirmationSms().listen
])


event.emit('user.registered')
```

## BaseEvent

The `BaseEvent` class enforces the usage of the `listen` method and has the capabilities to be extended by the framework, like injecting a context object as argument. It is completely optional to use, but if you decide on it, this is how it's used:

```js
const { Event, BaseEvent } = require('@sapphirejs/event')

class SendWelcomeEmail extends BaseEvent {
  listen(userId) {
    // send email to user with id=userId
  }
}

const event = new Event()
event.on('user.registered', new SendWelcomeEmail())
event.emit('user.registered', 7)
```

Notice how we don't pass the `listen` method on the event listener. It is automatically resolved when extending BaseEvent.

## Event Names

Event names can be anything unique, so a string or constant comes to mind. However, if you think about it, class are also a very good way of having non-string event names. You can't misspell them, because the runtime or even your IDE will complain, so fewer bugs. And they're so easy to use:

```js
class UserWasRegistered {}

event.on(UserWasRegistered, new SendWelcomeEmail())
event.on(UserWasRegistered, new SendConfirmationSms())

event.emit(UserWasRegistered)
```
