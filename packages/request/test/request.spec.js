const { Request, Adapter, BadRequestAdapter, BadRequestObject } = require('../index')

test('throws when adapter is not provided', () => {
  expect(() => {
    new Request()
  }).toThrow(BadRequestAdapter)
})

test('throws when adapter is not a valid object', () => {
  expect(() => {
    new Request('not.an.adapter')
  }).toThrow(BadRequestAdapter)
})

test('throws when adapter is not provided a request object', () => {
  expect(() => {
    new Request(new Adapter.Express())
  }).toThrow(BadRequestObject)
})

test('throws when adapter is not provided a valid request object', () => {
  expect(() => {
    new Request(new Adapter.Express('not.an.object'))
  }).toThrow(BadRequestObject)
})
