const { Container, ServiceNotFound } = require('../index')

const SimpleClass = require('./helpers/simple-class')
const FakeConfig = require('./helpers/fake-config')

test('adds a service and retrieves it', () => {
  const container = new Container()
  container.register(SimpleClass, () => {
    return new SimpleClass(5)
  })
  const simpleClass = container.resolve(SimpleClass)

  expect(simpleClass.getParameter()).toBe(5)
})

test('adds a service with a dependency', () => {
  const container = new Container()

  container.register(FakeConfig, () => {
    return new FakeConfig(1)
  })

  container.register(SimpleClass, () => {
    return new SimpleClass(container.resolve(FakeConfig))
  })

  const simpleClass = container.resolve(SimpleClass)

  expect(simpleClass.getParameter().getParameter()).toBe(1)
})

test('bind with string and class resolve differently', () => {
  const container = new Container()

  container.register(SimpleClass, () => {
    return new SimpleClass(2)
  })

  const simpleClass = container.resolve(SimpleClass)
  const simpleClass2 = container.resolve('SimpleClass')

  expect(simpleClass === simpleClass2).toBe(false)

  simpleClass.setParameter(5)
  expect(simpleClass2.getParameter()).toBe(2)
})

test('singleton instances are always the same', () => {
  const container = new Container()
  container.singleton(SimpleClass, () => {
    return new SimpleClass(3)
  })

  const simpleClass = container.resolve(SimpleClass)
  const simpleClass2 = container.resolve(SimpleClass)

  expect(simpleClass === simpleClass2).toBe(true)

  simpleClass.setParameter(5)
  expect(simpleClass2.getParameter()).toBe(5)
})

test('throws when trying to access an unknown service', () => {
  expect(() => {
    const container = new Container()
    container.resolve(SimpleClass)
  }).toThrow(ServiceNotFound)
})
