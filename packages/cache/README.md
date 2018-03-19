# Cache

A simple, but effective cache system that supports different drivers and promises. It currently has a Redis transport, which should be good for almost any usecase, and a memory transport mostly for testing.

## Usage

Install and initialize the cache with a Redis transport.

```
$ npm install --save @sapphirejs/cache
```

```js
const { Cache, Transport } = require('@sapphirejs/cache')

const cache = new Cache(new Transport.Redis({ host: '127.0.0.1', port: 6379 }))
await cache.set('name', 'sapphire')
const value = await cache.get('name')
```

By using `await` it's a breeze to work with. Just keep in mind that you'll need an `async` function to use `await`, something omitted for brevity. Redis configuration can be set according to [these options](https://github.com/NodeRedis/node_redis#options-object-properties) on the Redis client. For a local setup, they'll most probably work out of the box.

The `Redis` transport automatically executes `JSON.stringify()` when setting values, and `JSON.parse()` when retrieving them. There's no need to call them manually.

## API

A list of the supported methods:

**get(key)** Retrieve `key` from the cache or null if it doesn't exist.

**set(key, value, minutes = 60)** Set the `key` to `value` with an expiry of `minutes`.

**forever(key, value)** Set the `key` to `value` with a big expiry time.

**increment(key, amount = 1)** Increment the number value under `key` with `amount`.

**decrement(key, amount = 1)** Decrement the number value under `key` with `amount`.

**pop(key)** Retrieve `key` and delete it.

**has(key)** Check if `key` exists in the cache.

**delete(key)** Delete `key` from the cache.

**flush()** Delete all the keys from the cache.

## Custom Transports

Transports are classes that need to implement most of the methods above and wrap the return value into a promise. Let's imagine you need to build a `Memcached` driver. It should implement all the following methods:

```js
class MemcachedTransport {
  get(key) {}
  set(key, value, minutes) {}
  increment(key, amount) {}
  decrement(key, amount) {}
  has(key) {}
  delete(key) {}
  flush() {}
}
```

## Testing

A `Memory` transport is provided to ease testing without the need to hit Redis or write mocks for it. Just inject that instead of the actual transport you're using. An example in Jest:

```js
const cache = new Cache(new Transport.Memory())
cache.set('name', 'sapphire')
expect(cache.get('name')).toBe('sapphire')
```
