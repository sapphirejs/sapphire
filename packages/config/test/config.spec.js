const { Config } = require('../index')

const cfg = {
  key: 'value',
  somekey: {
    nestedKey: 'anothervalue'
  }
}

test('reads a key', () => {
  const config = new Config(cfg)

  expect(config.get('key')).toBe('value')
})

test('reads a deeply nested key', () => {
  const config = new Config(cfg)

  expect(config.get('somekey.nestedKey')).toBe('anothervalue')
})

test('returns the default value with an inexistant key', () => {
  const config = new Config(cfg)

  expect(config.get('i.dont.exist', 'default')).toBe('default')
})

test('returns null with an inexistent key', () => {
  const config = new Config(cfg)

  expect(config.get('')).toBe(null)
  expect(config.get('i.dont.exist')).toBe(null)
})

test("returns null when the key isn't a string", () => {
  const config = new Config(cfg)

  expect(config.get(['a', 'b'])).toBe(null)
})

test('returns null with an empty parameter', () => {
  const config = new Config(cfg)

  expect(config.get()).toBe(null)
})

test('returns boolean on check if key exists', () => {
  const config = new Config(cfg, true)

  expect(config.has('key')).toBe(true)
  expect(config.has('no.no')).toBe(false)
})
