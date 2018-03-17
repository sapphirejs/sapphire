const Hash = require('./lib/hash')
const Bcrypt = require('./lib/algorithms/bcrypt')
const Argon2 = require('./lib/algorithms/argon2')

module.exports = {
  Hash,
  Algorithm: {
    Bcrypt,
    Argon2
  }
}
