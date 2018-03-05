const IntlMessage = require('intl-messageformat')
const objectPath = require('object-path')
const MissingLocale = require('./errors/missing-locale')
const MissingLocaleKey = require('./errors/missing-locale-key')
const InvalidLocaleMessage = require('./errors/invalid-locale-message')

/**
* Internationalization package.
* @module sapphirejs/intl
*/
class Intl {
  /**
   * @param {Object} locales 
   * @param {string} locale 
   * @throws {MissingLocale} When locale doesn't exist
   */
  constructor(locales, locale) {
    this._locales = locales
    this._locale = locale
    this._tempLocale = null
    this._localeExists(locale)
  }

  /**
   * Formats a locale string with a given
   * key path.
   * @param {string} path 
   * @param {Object} data 
   * @returns {string}
   * @throws {MissingLocale} When locale doesn't exist
   * @throws {MissingLocaleKey} When locale key doesn't exist
   * @throws {InvalidLocaleMessage} when locale message is not well formatted
   */
  format(path, data) {
    let locale = this._tempLocale || this._locale
    this._localeExists(locale)
    this._tempLocale = null

    // Append the locale as a path, to reflect the
    // structure of the expected locales object.
    let localePath = `${locale}.${path}`
    // objectPath gets values from deeply nested object keys.
    let value = objectPath.get(this._locales, localePath)
    
    if (!value)
      throw new MissingLocaleKey(`Locale key '${path}' not found for locale '${locale}'`)

    try {
      let intl = new IntlMessage(value, locale)
      return intl.format(data)
    } catch(err) {
      throw new InvalidLocaleMessage(`Locale message on key '${path}' is invalid. System response: ${err.message}`)
    }
  }

  /**
   * Returns the current locale.
   * @returns {string}
   */
  get locale() {
    return this._locale
  }

  /**
   * Sets the locale dynamically.
   */
  set locale(locale) {
    this._locale = locale
  }

  /**
   * Sets the locale temporarily for a single
   * format call.
   * @param {string} locale 
   * @returns {Intl}
   */
  in(locale) {
    this._tempLocale = locale
    return this
  }

  /**
   * Checks if the locale exists.
   * @param {string} locale 
   * @throws {MissingLocale} When locale doesn't exist
   */
  _localeExists(locale) {
    if (!this._locales.hasOwnProperty(locale))
      throw new MissingLocale(`Locale '${locale}' not found`)
  }
}

module.exports = Intl