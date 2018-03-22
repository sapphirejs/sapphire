const { helpers } = require('../index')
const { test, expect } = global

test('Object has method', () => {
  expect(
    helpers.objectHasMethod(
      new class Something {
        handle() {}
      },
      'handle'
    )
  ).toBe(true)

  expect(
    helpers.objectHasMethod(
      new class Something {},
      'handle'
    )
  ).toBe(false)
})
