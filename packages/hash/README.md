# Hash

Generates and compares hashes using [bcrypt](https://github.com/kelektiv/node.bcrypt.js) or [argon2](https://github.com/ranisalt/node-argon2). It serves as a simple interface to those 2 libraries for easy of use and configuration internally in Sapphire Framework.

## Usage

The main `Hash` class takes an algorithm as a parameter, either `Algorithm.Bcrypt` or `Algorithm.Argon2`.

To generate a hash:

```js
const { Hash, Algorithm } = require('@sapphirejs/hash')

const hasher = new Hash(new Algorithm.Bcrypt())
const hash = await hasher.generate('sTr0nG_pA55')
```

To compare a plaintext password against a hash:

```js
if (await hasher.compare('some_pass', hash)) {
  // you got in!
}
```

Both `generate` and `compare` return a Promise, and when used with `await`, need to be called in an `async` function which was omitted in the examples for brevity.

## Configuration

Bcrypt takes a single `rounds` option that configures the number of rounds the module will go through to hash the password. The higher the value, the stronger the hash but the more expensive to compute. By default it's set to `12` rounds, which is a good start.

```js
new Hash(new Algorithm.Bcrypt({ rounds: 14 }))
```

Argon2 has more flexibility in terms of configuration. Below are the options it takes and their default values:

```js
new Hash(new Algorithm.Argon2({
  timeCost: 3,
  memoryCost: 12,
  parallelism: 1
}))
```

## Custom Algorithms

If you need to extend the provided algorithms with another third-party one, you can achieve it with a simple class that implements the `generate` and `compare` methods. Both of them should return promises. An example:

```js
class AwesomeAlgorithm {
  generate(plain) {
    // return the hash
  }

  compare(plain, hash) {
    // compare and return true|false
  }
}
```
