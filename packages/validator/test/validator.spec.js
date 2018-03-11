const { rule, Validator, ValidatorMiddleware } = require('../index')

let rules = {
  name: rule.string().alphanum().required(),
  email: rule.string().email().required(),
  age: rule.number().min(18).max(200)
}

class UserValidator extends ValidatorMiddleware {
  rules() {
    return rules
  }
}

test('passes schema validation', () => {
  const validator = new Validator({
    name: 'John',
    email: 'john@domain.com',
    age: 27
  }, rules)

  expect(validator.passes).toBe(true)
  expect(validator.fails).toBe(false)
  expect(validator.errors).toEqual({})
})

test('fails schema validation', () => {
  const validator = new Validator({
    email: 'john',
    age: 250
  }, rules)

  expect(validator.passes).toBe(false)
  expect(validator.fails).toBe(true)
  expect(validator.errors).not.toEqual({})
})

test('handles middleware validation', () => {
  const expressMock = (middleware, callback) => {
    let req = {
      body: {
        name: 'John',
        email: 'john@domain.com',
      },
      query: { age: 27 }
    }

    middleware(req, {}, () => { callback(req, {}) })
  }

  expressMock(new UserValidator().middleware, (req) => {
    expect(req.validator).toBeDefined()
    expect(req.validator.passes).toBe(true)
    expect(req.validator.fails).toBe(false)
    expect(req.validator.errors).toEqual({})
  })
})
