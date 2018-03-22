class SampleErrorHandler {
  /**
   *
   * @param {Response} response
   * @param error
   */
  handle(response, error) {
    return response.json({ error: 'error' })
  }
}

module.exports = SampleErrorHandler
