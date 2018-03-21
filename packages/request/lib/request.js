const BadRequestAdapter = require('./errors/bad-request-adapter')

class Request {
  constructor(adapter) {
    if (!adapter || typeof adapter !== 'object')
      throw new BadRequestAdapter('Request adapter must be a valid object.')

    this._adapter = adapter
  }

  get baseUrl() {
    return this._adapter.baseUrl
  }

  get body() {
    return this._adapter.body
  }

  get cookies() {
    return this._adapter.cookies
  }

  get fresh() {
    return this._adapter.fresh
  }

  get hostname() {
    return this._adapter.hostname
  }

  get ip() {
    return this._adapter.ip
  }

  get ips() {
    return this._adapter.ips
  }

  get method() {
    return this._adapter.method
  }

  get originalUrl() {
    return this._adapter.originalUrl
  }

  get params() {
    return this._adapter.params
  }

  get path() {
    return this._adapter.path
  }

  get protocol() {
    return this._adapter.protocol
  }

  get query() {
    return this._adapter.query
  }

  get route() {
    return this._adapter.route
  }

  get secure() {
    return this._adapter.secure
  }

  get signedCookies() {
    return this._adapter.signedCookies
  }

  get stale() {
    return this._adapter.stale
  }

  get subdomains() {
    return this._adapter.subdomains
  }

  get xhr() {
    return this._adapter.xhr
  }

  accepts(types) {
    return this._adapter.accepts(types)
  }

  acceptsCharsets(...charset) {
    return this._adapter.acceptsCharsets(...charset)
  }

  acceptsEncodings(...charset) {
    return this._adapter.acceptsEncodings(...charset)
  }

  acceptsLanguages(...charset) {
    return this._adapter.acceptsLanguages(...charset)
  }

  get(field) {
    return this._adapter.get(field)
  }

  is(type) {
    return this._adapter.is(type)
  }

  param(name, defaultValue = null) {
    return this._adapter.param(name, defaultValue)
  }

  range(size, options = {}) {
    return this._adapter.range(size, options)
  }
}



module.exports = Request
