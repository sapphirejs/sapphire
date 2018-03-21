const BadRequestObject = require('../errors/bad-request-object')

class Request {
  constructor(request) {
    if (!request || typeof request !== 'object')
      throw new BadRequestObject('Request adapter expects a valid request object.')

    this._request = request
  }

  get baseUrl() {
    return this._request.baseUrl
  }

  get body() {
    return this._request.body
  }

  get cookies() {
    return this._request.cookies
  }

  get fresh() {
    return this._request.fresh
  }

  get hostname() {
    return this._request.hostname
  }

  get ip() {
    return this._request.ip
  }

  get ips() {
    return this._request.ips
  }

  get method() {
    return this._request.method
  }

  get originalUrl() {
    return this._request.originalUrl
  }

  get params() {
    return this._request.params
  }

  get path() {
    return this._request.path
  }

  get protocol() {
    return this._request.protocol
  }

  get query() {
    return this._request.query
  }

  get route() {
    return this._request.route
  }

  get secure() {
    return this._request.secure
  }

  get signedCookies() {
    return this._request.signedCookies
  }

  get stale() {
    return this._request.stale
  }

  get subdomains() {
    return this._request.subdomains
  }

  get xhr() {
    return this._request.xhr
  }

  accepts(types) {
    return this._request.accepts(types)
  }

  acceptsCharsets(...charset) {
    return this._request.acceptsCharsets(...charset)
  }

  acceptsEncodings(...charset) {
    return this._request.acceptsEncodings(...charset)
  }

  acceptsLanguages(...charset) {
    return this._request.acceptsLanguages(...charset)
  }

  get(field) {
    return this._request.get(field)
  }

  is(type) {
    return this._request.is(type)
  }

  param(name, defaultValue = null) {
    return this._request.param(name, defaultValue)
  }

  range(size, options = {}) {
    return this._request.range(size, options)
  }
}



module.exports = Request
