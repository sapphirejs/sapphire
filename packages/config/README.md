# Config

A simple configuration package mostly to be used internally for Sapphire Framework.

## Usage

```
$ npm install --save @sapphirejs/config
```

Imagining we have a configuration file under with the following contents:

```js
const cfg = {
  name: 'sapphire',
  secret: {
    password: 'framw123'
  }
}
```

We can access those configuration options by simply:

```js
const Config = require('@sapphirejs/config')

const config = new Config(cfg)
config.get('name') // sapphire
```

It even supports path syntax for deep nested object keys:

```js
config.get('secret.password') // framw123
```

A default value can be passed if a key doesn't exist:

```js
config.get('i.dont.exist', 'or maybe i do') // or maybe i do
```

To quickly check if a quick exists:

```js
config.has('app.name') // true
```
