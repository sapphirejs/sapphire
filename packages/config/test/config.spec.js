const Config = require('../lib/config')
const BadArguments = require('../lib/bad-arguments')
let { test, expect } = global

const directory = '/tests/helpers/config'

test('Test config with a root folder', () => {
  let config = new Config(directory)
  expect(config.get('app.key')).toBe('value')
  expect(config.get('app.somekey.nestedKey')).toBe('anothervalue')
})

test('Test getting only the conf file without keys', () => {
  let config = new Config(directory)
  expect(config.get('app')).toBe(require('./helpers/config/app'))
})

test('Test without a key', () => {
  let config = new Config(directory)
  expect(config.get('')).toBe(null)
})

test('Key doesn\'t exists', () => {
  let config = new Config(directory)
  expect(config.get('app.somekey.notAKey')).toBe(null)
})

test('Test config with preload', () => {
  let config = new Config(directory, true)
  expect(config.get('app.key')).toBe('value')
})

test('Test without a key as a parameter', () => {
  let config = new Config(directory, true)
  expect(config.get()).toBe(null)
})

test('Test the default configFolder to throw an exception as the package doesn\'t have a folder with that name', () => {
  expect(() => {new Config()}).toThrowError(BadArguments)
})

test('Error is thrown when a bad folder path is given', () => {
  expect(() => {
    new Config('/not_a_folder_also_with_underscores')
  }).toThrowError(BadArguments)
})

test('Error is thrown when a bad preload argument is provided', () => {
  expect(() => {
    new Config(directory, 'not_a_boolean_also_with_underscore')
  }).toThrowError(BadArguments)
})
