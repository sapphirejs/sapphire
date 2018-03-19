const { Cache, Transport, BadCacheTransport } = require('../index')

test('sets and gets a key', () => {
  const cache = new Cache(new Transport.Memory())
  cache.set('name', 'test')

  expect(cache.get('name')).toBe('test')
})

test('sets a key forever', () => {
  const cache = new Cache(new Transport.Memory())
  cache.forever('name', 'test')

  expect(cache.get('name')).toBe('test')
})

test('returns null for inexistant key', () => {
  const cache = new Cache(new Transport.Memory())

  expect(cache.get('name')).toBeNull()
})

test('increments a key', () => {
  const cache = new Cache(new Transport.Memory())
  cache.set('i', 15)

  expect(cache.increment('i')).toBe(16)
  expect(cache.increment('i', 2)).toBe(18)
})

test('decrements a key', () => {
  const cache = new Cache(new Transport.Memory())
  cache.set('i', 15)

  expect(cache.decrement('i')).toBe(14)
  expect(cache.decrement('i', 2)).toBe(12)
})

test('key exists', () => {
  const cache = new Cache(new Transport.Memory())
  cache.set('name', 'test')

  expect(cache.has('name')).toBe(true)
  expect(cache.has('not.found')).toBe(false)
})

test('deletes a key', () => {
  const cache = new Cache(new Transport.Memory())
  cache.set('name', 'test')

  expect(cache.has('name')).toBe(true)

  cache.delete('name')

  expect(cache.has('name')).toBe(false)
})

test('retrieves and deletes a key', () => {
  const cache = new Cache(new Transport.Memory())
  cache.set('name', 'test')

  expect(cache.pop('name')).toBe('test')
  expect(cache.has('name')).toBe(false)
})

test('flushes all keys', () => {
  const cache = new Cache(new Transport.Memory())
  cache.set('name', 'test')
  cache.set('email', 'test@test')
  cache.flush()

  expect(cache.has('name')).toBe(false)
  expect(cache.has('email')).toBe(false)
})

test('throws when transport is missing', () => {
  expect(() => {
    new Cache()
  }).toThrow(BadCacheTransport)
})

test('throws when transport is not a valid object', () => {
  expect(() => {
    new Cache('hi')
  }).toThrow(BadCacheTransport)
})
