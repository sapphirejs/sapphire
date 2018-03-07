/**
 * Vie Base Class.
 *
 * @class View
 */
class View {
  /**
   * @param {Object} response
   */
  constructor(response) {
    this._response = response
  }

  /**
   * Output HTML content.
   *
   * @public
   * @param {string} content
   * @returns {Object}
   */
  html(content) {
    return this.response.html(content)
  }

  /**
   * Output JSON content.
   *
   * @public
   * @param {string} content
   * @returns {Object}
   */
  json(content) {
    return this.response.json(content)
  }

  /**
   * Output JSONP content.
   *
   * @public
   * @param {string} content
   * @returns {Object}
   */
  jsonp(content) {
    return this.response.jsonp(content)
  }

  /**
   * Output XML content.
   *
   * @public
   * @param {string} content
   * @returns {Object}
   */
  xml(content) {
    return this.response.xml(content)
  }
}

module.exports = View
