# Validator

A very thin wrapper on top of the fantastic [Joi](https://github.com/hapijs/joi), mostly to provide simpler error handling and validator as middleware. If you know how to use Joi, than you'll feel right at home. Even if you don't, you're minutes away at pumping some awesome validation action.

## Schema

Schemas are plain object literals with the field name as the key and a set of chained functions to declare validation rules. Let's see an example:

```javascript
const { rule, Validator } = require('@sapphirejs/validator')

let validator = new Validator({
    name: 'John',
    email: 'john@domain.com',
    age: 27
  }, {
  name: rule.string().alphanum().required(),
  email: rule.string().email().required(),
  age: rule.number().min(18).max(200)
})
```

We've just input some data and a schema declaration for each of those inputs. Just remember that each validation should start with `rule` and move on with the chain of functions. Read more at the [Joi API Documentation](https://github.com/hapijs/joi/blob/v13.1.2/API.md) for the available data types and validation functions.

Now that we've run the validator, it exposes some properties to check if it failed or not:

```javascript
validator.passes // true | false
validator.fails // true | false
```

Errors are returned in an object literal, so you can further process it or dump it directly as JSON output:

```javascript
validator.errors
/*
ie: {
  name: ['"name" is required'],
  email: ['"email" is required', '"email" is not a valid email'],
}
*/
```

## Middleware

Probably more interesting and streamlined than manually validating every request, middlewares can be injected into routes (or globally if that's what you need) and automate validation. They are very simple classes that declare the validation rules, while the rest is handled automatically.

Let's imagine we have a `POST /users` route where we send a body of parameters to create a new user.

```javascript
app.post('/users', (req, res) => { /* handle user creation */ })
```

Next we build a `UserValidator` class that defines the validation rules:

```javascript
const { ValidatorMiddleware } = require('sapphire-validator')

class UserValidator extends ValidatorMiddleware {
  rules() {
    return {
      name: 'John',
      email: 'john@domain.com',
      age: 27
    }
  }
}
```

And that's basically it. If we inject that class as a middleware, the request's body will be validated against those rules and a `validator` instance passed in the request object.

```javascript
const UserValidator = require('./validators/uservalidator')

app.post('/users', new UserValidator().middleware, (req, res) => {
  if (req.validator.fails)
    res.status(422).json(req.validator.errors)

  /* handle user creation */
})
```

By default, the middleware will read `req.body` and `req.query` as input sources. If you need more control, like including `req.params` or cookies, you can always define your own `fields()` function inside a middleware class.

```javascript
const { ValidatorMiddleware } = require('sapphire-validator')

class UserValidator extends ValidatorMiddleware {
  fields(req) {
    return {...req.body, ...req.params}
  }

  /* rules omited for brevity */
}
```

Or even manually define what fields you need:

```javascript
const { ValidatorMiddleware } = require('sapphire-validator')

class UserValidator extends ValidatorMiddleware {
  fields(req) {
    return {
      name: req.body.name,
      age: req.query.age
    }
  }

  /* rules omited for brevity */
}
```
