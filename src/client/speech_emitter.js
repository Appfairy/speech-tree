class SpeechEmitter {
  constructor(options = {}) {
    this._events = new Map();
    this._handlers = new Map();
  }

  on(test, handler) {
    if (test instanceof Array) {
      if (handler != null) {
        if (typeof handler != 'function') {
          throw TypeError('handler must be a function');
        }

        test.forEach((test) => {
          this.on(test, handler);
        });
      }
      else {
        test.forEach(([test, handler]) => {
          this.on(test, handler);
        });
      }

      return;
    }

    if (test == null) {
      throw TypeError('test must be provided');
    }

    if (!(test instanceof RegExp) &&
        typeof test != 'string' &&
        typeof test != 'function') {
      throw TypeError('test must be a regular expression, a string or a function');
    }

    if (handler == null) {
      throw TypeError('handler must be provided');
    }

    if (typeof handler != 'function') {
      throw TypeError('handler must be a function');
    }

    let handlers = this._events.get(test);

    if (handlers == null) {
      handlers = new Map();
      this._events.set(test, handlers);
    }

    handlers.set(handler, handler);
  }

  once(test, handler) {
    if (test instanceof Array) {
      if (handler != null) {
        if (typeof handler != 'function') {
          throw TypeError('handler must be a function');
        }

        test.forEach((test) => {
          this.once(test, handler);
        });
      }
      else {
        test.forEach(([test, handler]) => {
          this.once(test, handler);
        });
      }

      return;
    }

    if (test == null) {
      throw TypeError('test must be provided');
    }

    if (!(test instanceof RegExp) &&
        typeof test != 'string' &&
        typeof test != 'function') {
      throw TypeError('test must be a regular expression, a string or a function');
    }

    if (handler == null) {
      throw TypeError('handler must be provided');
    }

    if (typeof handler != 'function') {
      throw TypeError('handler must be a function');
    }

    const wrappedHandler = (...args) => {
      self.off(pattern, handler);
      handler(...args);
    };

    let handlers = this._events.get(test);

    if (handlers == null) {
      handlers = new Map();
      this._events.set(test, handlers);
    }

    handlers.set(handler, wrappedHandler);
  }

  off(test, handler) {
    if (test == null && handler == null) {
      this._events = new Map();
      return;
    }

    if (handler == null) {
      this._events.delete(test);
      return;
    }

    const handlers = this._events.get(test);

    if (handlers != null) {
      handlers.delete(handler);
    }
  }

  trigger(sentence, ...args) {
    if (sentence == null) {
      throw TypeError('sentence must be provided');
    }

    if (typeof sentence != 'string') {
      throw TypeError('sentence must be a string');
    }

    this._events.forEach((handlers, test) => {
      let result;

      if (typeof test == 'function') {
        result = test(sentence, ...args);
      }
      else if (test instanceof RegExp) {
        result = sentence.match(test);
      }
      else {
        result = result === test && test;
      }

      if (result == null) return;

      if (typeof result.then != 'function' ||
          typeof result.catch != 'function') {
        result = Promise.resolve(result);
      }

      result.then((args) => {
        if (args == null) return;

        args = [].concat(args);

        handlers.forEach((handler) => {
          handler(...args);
        });
      })
      .catch((error) => {
        console.error(error);
      });
    });
  }
}

export default SpeechEmitter;
