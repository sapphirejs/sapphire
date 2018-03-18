# Internationalization

An Internationalization (Intl for short) package that formats locale strings. It is a thin wrapper on top of [formatjs](https://formatjs.io/) that provides a few facilities like deep nested object paths and changing the locale dynamically.

## Locale Object

Before diving into its usage, you need to have a correctly formatted plain Javascript object with the locale keys and messages. It may look something like the one below, but it can be as nested as you need.

```javascript
let locales = {
  'en-us': {
    welcome: 'Welcome {name}',
    messages: `You have {messages, plural, =0 {no messages} one {1 message} other {{messages} messages}}`,
    first: { second: { third: `Hi {name} from deep nested key` }}
  },
  'sq-al': {
    welcome: 'Miresevjen {name}',
    messages: `Ju {messages, plural, =0 {s'keni asnje mesazh} one {keni 1 mesazh} other {keni {messages} mesazhe}}`
  }
}
```

## Usage

For the simplest and probably most typical case, you may have a greeting message in your website:

```javascript
const Intl = require('@sapphirejs/intl')

new Intl(locales, 'en-us')
  .format('welcome', { name: 'John' })
// Welcome John
```

For the plural forms, the message format is more contrived with different cases of occurrence, but it's usage is exactly the same:

```javascript
new Intl(locales, 'en-us')
  .format('messages', { messages: 0 })
// You have no messages
```

No matter how deep objects are nested, they can be easily accessed as a path:

```javascript
new Intl(locales, 'en-us')
  .format('first.second.third', { name: 'John' })
// Hi John  from deep nested key
```


Language can be set dynamically after initialization:

```javascript
let intl = new Intl(locales, 'en-us')
intl.locale = 'sq-al'
intl.format('welcome', { name: 'Xhon' })
// Miresevjen Xhon
```

Or even temporarly for a single call of `format()`:

```javascript
let intl = new Intl(locales, 'en-us')
intl.in('sq-al').format('welcome', { name: 'Xhon' })
// Miresevjen Xhon
```

Finally, you can set a fallback locale during initialization. That locale will be used to search the key if it doesn't exist in the main one.

```javascript
new Intl(locales, 'sq-al', 'en-us')
  .format('first.second.third', { name: 'John' })
// Hi John from deep nested key
```
