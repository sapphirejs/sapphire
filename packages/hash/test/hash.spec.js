const { Hash, Algorithm } = require('../index')

test('hashes and compares with bcrypt', async () => {
  const hasher = new Hash(new Algorithm.Bcrypt())
  const password = 'hello_from_mars'
  const hash = await hasher.generate(password)

  expect(await hasher.compare(password, hash)).toBe(true)
})

test('hashes and compares with argon2', async () => {
  const hasher = new Hash(new Algorithm.Argon2())
  const password = 'hello_from_callisto'
  const hash = await hasher.generate(password)

  expect(await hasher.compare(password, hash)).toBe(true)
})
