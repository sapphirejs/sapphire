const { Event, InvalidEventHandler } = require('../index')

test('listener is called', () => {
  const event = new Event()
  const handler = jest.fn()
  event.on('user.registered', handler)
  event.emit('user.registered')

  expect(handler).toBeCalled()
})

test('listener is called with class as event name', () => {
  class UserWasRegistered {}

  const event = new Event()
  const handler = jest.fn()
  event.on(UserWasRegistered, handler)
  event.emit(UserWasRegistered)

  expect(handler).toBeCalled()
})

test('multiple listeners are called', () => {
  const event = new Event()
  const handlerOne = jest.fn()
  const handlerTwo = jest.fn()
  event.on('user.registered', handlerOne)
  event.on('user.registered', handlerTwo)
  event.emit('user.registered')

  expect(handlerOne).toBeCalled()
  expect(handlerTwo).toBeCalled()
})

test('array of listeners are called', () => {
  const event = new Event()
  const handlerOne = jest.fn()
  const handlerTwo = jest.fn()
  event.on('user.registered', [handlerOne, handlerTwo])
  event.emit('user.registered')

  expect(handlerOne).toBeCalled()
  expect(handlerTwo).toBeCalled()
})

test('listener is called once', () => {
  const event = new Event()
  const handler = jest.fn()
  event.once('user.registered', handler)
  event.emit('user.registered')
  event.emit('user.registered')

  expect(handler).toHaveBeenCalledTimes(1)
})

test('listener receives parameters', () => {
  const event = new Event()
  const handler = jest.fn()
  event.once('user.registered', handler)
  event.emit('user.registered', 'email@example.com', 10)

  expect(handler).toBeCalledWith('email@example.com', 10)
})

test('retrieves an array of listeners', () => {
  const event = new Event()
  const handlerOne = () => {}
  const handlerTwo = () => {}
  event.on('user.registered', [handlerOne, handlerTwo])

  expect(event.listeners('user.registered')).toEqual([handlerOne, handlerTwo])
})

test('counts listeners', () => {
  const event = new Event()
  const handlerOne = () => {}
  const handlerTwo = () => {}
  event.on('user.registered', [handlerOne, handlerTwo])

  expect(event.count('user.registered')).toBe(2)
})

test('retrieves the names of all registered events', () => {
  const event = new Event()
  event.on('user.registered', () => {})
  event.on('user.signed', () => {})

  expect(event.names()).toEqual(['user.registered', 'user.signed'])
})

test("throws if handler isn't a function", () => {
  expect(() => {
    const event = new Event()
    event.on('user.registered', 'not a function')
  }).toThrow(InvalidEventHandler)
})
