/**
 * Response Wrapper.
 * 
 * @class Response
 */
class Response {
  constructor() {
    this._response = {
      type: null,
      status: 200,
      content: null,
      parameters: {},
      download: false,
      end: false,
      redirect: false,
      raw: false
    }
  }

  /**
   * Render a template file.
   *
   * @public 
   * @param {string} file 
   * @param {Object} parameters 
   * @returns {Object}
   */
  render(file, parameters) {
    this._response.type = this._response.type || 'text/html'
    this._response.parameters = {
      file, data: parameters
    }
    return this._response
  }

  /**
   * Output HTML.
   *
   * @public 
   * @param {string} content 
   * @returns {Object}
   */
  html(content) {
    this._response.type = this._response.type || 'text/html'
    this._response.content = content
    return this._response
  }

  /**
   * Output JSON.
   *
   * @public 
   * @param {content} file 
   * @returns {Object}
   */
  json(content) {
    this._response.type = this._response.type || 'application/json'
    this._response.content = content
    return this._response
  }

  /**
   * Output JSONP.
   *
   * @public 
   * @param {string} content 
   * @returns {Object}
   */
  jsonp(content) {
    this._response.type = this._response.type || 'application/json'
    this._response.content = content
    return this._response
  }

  /**
   * Output XML.
   *
   * @public 
   * @param {string} content 
   * @returns {Object}
   */
  xml(content) {
    this._response.type = this._response.type || 'text/xml'
    this._response.content = content
    return this._response
  }

  /**
   * Output a file for download.
   *
   * @public 
   * @param {string} file 
   * @returns {Object}
   */
  download(file) {
    this._response.download = true
    this._response.parameters = { file }
    return this._response
  }

  /**
   * End the response without output.
   *
   * @public 
   * @param {string} data 
   * @returns {Object}
   */
  end(data = null) {
    this._response.end = true
    return this._response
  }

  /**
   * Redirect to a URL.
   *
   * @public 
   * @param {string} url 
   * @returns {Object}
   */
  redirect(url) {
    this._response.redirect = true
    this._response.parameters = { url }
    return this._response
  }

  /**
   * Output a RAW response without futher
   * processing.
   *
   * @public 
   * @param {string} content
   * @returns {Object}
   */
  raw(content) {
    this._response.raw = true
    this._response.content = content
    return this._response
  }

  /**
   * Sets the HTTP status.
   *
   * @public 
   * @param {number} status 
   * @returns {Response}
   */
  status(status) {
    this._response.status = status
    return this
  }

  /**
   * Sets the content type.
   *
   * @public 
   * @param {string} type 
   * @returns {Response}
   */
  type(type) {
    this._response.type = type
    return this
  }
}

module.exports = Response