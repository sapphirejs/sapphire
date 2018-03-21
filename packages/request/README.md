# Request

A request wrapper with multiple adapters intended for internal use in Sapphire Framework. It basically takes a request object from a server framework (currently only Express) and wraps it in a generic class.

## Usage

```
$ npm install --save @sapphirejs/request
```

```js
const { Request, Adapter } = require('@sapphirejs/request')
const req // request from express
const request = new Request(new Adapter.Express(req))
request.body
request.params[0]
```
