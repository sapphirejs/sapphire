# Sapphire Config

A simple configuration package mostly to be used internally for Sapphire Framework.

## Usage

Imagining we have a configuration file under `config/directory/app.js` with the following contents:

```js
module.exports = {
  name: 'sapphire',
  secret: {
    password: 'framw123'
  }
}
```

We can access those configuration options by simply:

```js
const Config = require('@sapphirejs/config')

const config = new Config('config/directory')
config.get('app.name') // sapphire
```

It even supports path syntax for deep nested object keys:

```js
config.get('app.secret.password') // framw123
```

To quickly check if a quick exists:

```js
config.has('app.name') // true
```
