/**
 * Event base class supposed to be
 * extended by other event classes.
 *
 * @class BaseEvent
 */
class BaseEvent {
  constructor() {
    // As the "listen" method of sub classes will be
    // passed as a parameter to the event, bind this
    // so it can take the class scope.
    if (this.listen)
      this.listen = this.listen.bind(this)
  }
}

module.exports = BaseEvent
