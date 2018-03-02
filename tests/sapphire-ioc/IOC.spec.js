const {
  IOC,
  ServiceNotFound
} = require('sapphire-ioc')

let { test, expect} = global

// Import helpers
const SimpleClass = require('./helpers/SimpleClass')
const FakeConfig = require('./helpers/FakeConfig')

test('Add a Service and retrieve it', () => {
  let ioc = new IOC()
  ioc.bind(SimpleClass, () => (
    new SimpleClass(5)
  ))
  const simpleClass = ioc.make(SimpleClass)
  expect(simpleClass.getParameter()).toBe(5)
})

test('Add a service with depedency', () => {
  let ioc = new IOC()

  // Register a Service
  ioc.bind(FakeConfig, () => (
    new FakeConfig(1)
  ))

  // Register a Sercice with depedency
  ioc.bind(SimpleClass, () => (
    new SimpleClass(ioc.make(FakeConfig))
  ))

  const simpleClass = ioc.make(SimpleClass)

  expect(
    simpleClass.getParameter().getParameter()
  ).toBe(1)

})

test('Two services with bind are different', () => {
  let ioc = new IOC()

  ioc.bind(SimpleClass, () => (
    new SimpleClass(2)
  ))

  const simpleClass = ioc.make(SimpleClass)
  const simpleClass2 = ioc.make("SimpleClass") // This is the same as SimpleClass

  expect(simpleClass === simpleClass2)
    .toBe(false)

  simpleClass.setParameter(5)
  expect(simpleClass2.getParameter()).toBe(2)
})

test('Error is thrown when trying to acess an unknown service', () => {
  let ioc = new IOC()

  expect(() => {
    ioc.make(SimpleClass)
  }).toThrowError(ServiceNotFound)
})

test('Singleton instances are always the same', () => {
  let ioc = new IOC()
  ioc.singleton(SimpleClass, () => (
    new SimpleClass(3)
  ))

  const simpleClass = ioc.make(SimpleClass)
  const simpleClass2 = ioc.make(SimpleClass)

  expect(simpleClass === simpleClass2).toBe(true)

  simpleClass.setParameter(5)
  expect(simpleClass2.getParameter()).toBe(5)
})
