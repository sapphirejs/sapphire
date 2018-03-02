<p>
  <img src="https://david-dm.org/sapphire-framework/sapphire-ioc.svg" alt="Dependencies" />
  <img src="https://travis-ci.org/sapphire-framework/sapphire-ioc.svg?branch=master" alt="Build status" />
  <a href='https://coveralls.io/github/sapphire-framework/sapphire-ioc?branch=master'><img src='https://coveralls.io/repos/github/sapphire-framework/sapphire-ioc/badge.svg?branch=master' alt='Coverage Status' /></a>
</p>

## Sapphire IOC

This is a simple IOC container implementation on NodeJS. You can register services on it and retrieve it later.


### Register with bind

You can register a service using the `bind` method and passing a callback on how the service should build when is accessed later. The IOC container will always create a new instance when the `ioc.make()` is executed.

```js
// SimpleClass.js
class SimpleClass {
    constructor(parameter) {
        this._parameter = parameter
    }

    getParameter() {
        return this._parameter
    }

    setParameter(parameter) {
        this._parameter = parameter
    }
}

module.exports = SimpleClass
```

```js
const IOC = require('sapphire-ioc')
const SimpleClass = require('./SimpleClass.js')

let ioc = new IOC()
ioc.bind(SimpleClass, () => (
    new SimpleClass(5)
))
const simpleClass = ioc.make(SimpleClass)
```

### Register with singleton

```js
const IOC = require('sapphire-ioc')
const SimpleClass = require('./SimpleClass.js')

let ioc = new IOC()
ioc.singleton(SimpleClass, () => (
    new SimpleClass(5)
))
const simpleClass = ioc.make(SimpleClass)
const simpleClass2 = ioc.make(SimpleClass)

simpleClass.setParameter(3)
simpleClass2.getParameter()     // 3
```

### License
MIT
