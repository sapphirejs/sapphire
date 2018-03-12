const Emitter = require('events')
const BaseEvent = require('./base-event')
const InvalidEventHandler = require('./errors/invalid-event-handler')

/**
 * Event system on top of Node's native Event.
 *
 * @class Event
 */
class Event {
  constructor() {
    this._emitter = new Emitter()
  }

  /**
   * Adds a listener.
   *
   * @public
   * @param {string} event
   * @param {array|function} callback
   */
  on(event, callback) {
    this._registerEvent('on', event, callback)
  }

  /**
   * Adds a listener to be executed once.
   *
   * @public
   * @param {string} event
   * @param {array|function} callback
   */
  once(event, callback) {
    this._registerEvent('once', event, callback)
  }

  /**
   * Emits an event to all listeners.
   *
   * @public
   * @param {string} event
   * @param {array} params
   */
  emit(event, ...params) {
    this._emitter.emit(event, ...params)
  }

  /**
   * Gets all the registered listeners.
   *
   * @public
   * @param {string} event
   * @returns {array}
   */
  listeners(event) {
    return this._emitter.listeners(event)
  }

  /**
   * Counts registered listeners.
   *
   * @public
   * @param {string} event
   * @returns {int}
   */
  count(event) {
    return this._emitter.listenerCount(event)
  }

  /**
   * Gets the names of all the registered events.
   *
   * @public
   * @returns {array}
   */
  names() {
    return this._emitter.eventNames()
  }

  /**
   * Checks the type of the callback and registers
   * the listeners accordinhly.
   *
   * @private
   * @param {string} type
   * @param {string} event
   * @param {array|function} callback
   * @throws {InvalidEventHandler} if the callback isn't a function
   */
  _registerEvent(type, event, callback) {
    if (Array.isArray(callback)) {
      callback.forEach(cb => {
        this._addListener(type, event, cb)
      })
    }
    else if (typeof callback === 'function' || callback instanceof BaseEvent)
      this._addListener(type, event, callback)
    else
      throw new InvalidEventHandler(`Event.${type} expects a function or an array of functions as event handlers.`)
  }

  /**
   * Adds a listener for the event.
   *
   * @private
   * @param {string} type
   * @param {string} event
   * @param {array|function} callback
   */
  _addListener(type, event, callback) {
    this._emitter[type](event, this._checkForBaseType(callback))
  }

  /**
   * Checks if the callback is in instance of
   * BaseEvent and automatically get it's "listen"
   * method.
   *
   * @private
   * @param {function} callback
   * @returns {function}
   * @throws {InvalidEventHandler} if the instance doesn't implement a "listen" method
   */
  _checkForBaseType(callback) {
    if (callback instanceof BaseEvent) {
      if (!callback.listen)
        throw new InvalidEventHandler(`Event class that extends BaseEvent must declare a "listen" method.`)

      return callback.listen
    }

    return callback
  }
}

module.exports = Event
