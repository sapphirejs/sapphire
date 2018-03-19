const Cache = require('./lib/cache')
const Redis = require('./lib/transports/redis')
const Memory = require('./lib/transports/memory')
const BadCacheTransport = require('./lib/errors/bad-cache-transport')

module.exports = {
  Cache,
  BadCacheTransport,
  Transport: {
    Redis,
    Memory
  }
}
