const { Cache, Transport, BadCacheTransport } = require('../index')

test('sets and gets a key', async () => {
  const cache = new Cache(new Transport.Memory())
  await cache.set('name', 'test')

  expect(await cache.get('name')).toBe('test')
})

test('sets a key forever', async () => {
  const cache = new Cache(new Transport.Memory())
  await cache.forever('name', 'test')

  expect(await cache.get('name')).toBe('test')
})

test('returns null for inexistant key', async () => {
  const cache = new Cache(new Transport.Memory())

  expect(await cache.get('name')).toBeNull()
})

test('increments a key', async () => {
  const cache = new Cache(new Transport.Memory())
  await cache.set('i', 15)

  expect(await cache.increment('i')).toBe(16)
  expect(await cache.increment('i', 2)).toBe(18)
})

test('decrements a key', async () => {
  const cache = new Cache(new Transport.Memory())
  await cache.set('i', 15)

  expect(await cache.decrement('i')).toBe(14)
  expect(await cache.decrement('i', 2)).toBe(12)
})

test('overrides a key', async () => {
  const cache = new Cache(new Transport.Memory())
  await cache.set('name', 'test')
  await cache.override('name', 'overriden')
  await cache.override('not.found', 'overriden')

  expect(await cache.get('name')).toBe('overriden')
  expect(await cache.get('not.found')).toBeNull()
})

test('adds a key only if it does not exist', async () => {
  const cache = new Cache(new Transport.Memory())
  await cache.set('name', 'test')
  await cache.add('name', 'hello')
  await cache.add('email', 'hi@there')

  expect(await cache.get('name')).toBe('test')
  expect(await cache.get('email')).toBe('hi@there')
})

test('key exists', async () => {
  const cache = new Cache(new Transport.Memory())
  await cache.set('name', 'test')

  expect(await cache.has('name')).toBe(true)
  expect(await cache.has('not.found')).toBe(false)
})

test('deletes a key', async () => {
  const cache = new Cache(new Transport.Memory())
  await cache.set('name', 'test')

  expect(await cache.has('name')).toBe(true)

  await cache.delete('name')

  expect(await cache.has('name')).toBe(false)
})

test('retrieves and deletes a key', async () => {
  const cache = new Cache(new Transport.Memory())
  await cache.set('name', 'test')

  expect(await cache.pop('name')).toBe('test')
  expect(await cache.has('name')).toBe(false)
})

test('flushes all keys', async () => {
  const cache = new Cache(new Transport.Memory())
  await cache.set('name', 'test')
  await cache.set('email', 'test@test')
  await cache.flush()

  expect(await cache.has('name')).toBe(false)
  expect(await cache.has('email')).toBe(false)
})

test('throws when transport is missing', async () => {
  expect(() => {
    new Cache()
  }).toThrow(BadCacheTransport)
})

test('throws when transport is not a valid object', async () => {
  expect(() => {
    new Cache('hi')
  }).toThrow(BadCacheTransport)
})
