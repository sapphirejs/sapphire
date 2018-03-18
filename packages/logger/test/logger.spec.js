const { Logger, BadLoggerTransport } = require('../index')

test('throws when transport is missing', () => {
  expect(() => {
    new Logger({})
  }).toThrow(BadLoggerTransport)
})

test('throws when transport is not a valid object', () => {
  expect(() => {
    new Logger({}, 'not.a.transport')
  }).toThrow(BadLoggerTransport)
})
