const { Config, ConfigDirNotFound } = require('../index')

const directory = '/test/helpers/config'

test('reads an existing directory', () => {
  const config = new Config(directory)

  expect(config.get('app')).toBe(require('./helpers/config/app'))
})

test('reads keys from an existing file', () => {
  const config = new Config(directory)

  expect(config.get('app.key')).toBe('value')
  expect(config.get('app.somekey.nestedKey')).toBe('anothervalue')
})

test('returns null with an inexistent key', () => {
  const config = new Config(directory)

  expect(config.get('')).toBe(null)
  expect(config.get('i.dont.exist')).toBe(null)
})

test("returns null when the key isn't a string", () => {
  const config = new Config(directory)

  expect(config.get(['a', 'b'])).toBe(null)
})

test('returns null with an empty parameter', () => {
  const config = new Config(directory, true)

  expect(config.get()).toBe(null)
})

test('returns boolean on check if key exists', () => {
  const config = new Config(directory, true)

  expect(config.has('app.key')).toBe(true)
  expect(config.has('app.no.no')).toBe(false)
})

test("throws when the config directory doesn't exist", () => {
  expect(() => {
    new Config('/not_a_directory')
  }).toThrow(ConfigDirNotFound)
})
