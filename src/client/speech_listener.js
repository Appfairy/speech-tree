import SpeechRecognition from 'speech_recognition';

// SpeechListener is the same as an event emitter, only it listens to speech events based
// on strings, regular expressions and manual test functions. The test functions should
// return an array of arguments (or a promise of an array of arguments) which should be
// invoked with the event
class SpeechListener {
  get listening() {
    return this._listening;
  }

  constructor(options = {}) {
    this._events = new Map();
    this._handlers = new Map();
    this._listening = false;
    this._speechRecognition = new SpeechRecognition();
    this._speechRecognition.continuous = options.continuous;
    this._onresult = this._handleSpeechResult.bind(this);
  }

  start() {
    this._speechRecognition.start();
    this._listening = true;
  }

  stop() {
    this._speechRecognition.stop();
    this._listening = false;
  }

  on(test, handler) {
    if (test instanceof Array) {
      test.forEach(([test, handler]) => {
        this.on(test, handler);
      });

      return;
    }

    let handlers = this._events.get(test);

    if (!handlers) {
      handlers = new Map();
      this._events.set(test, handlers);
    }

    handlers.set(handler, handler);
  }

  off(test, handler) {
    if (!test && !handler) {
      this._events = new Map();
      return;
    }

    if (!handler) {
      this._events.delete(test);
      return;
    }

    const handlers = this._events.get(test);

    if (handlers) {
      handlers.delete(handler);
    }
  }

  trigger(sentence) {
    this._events.forEach((handlers, test) => {
      let result;

      if (typeof test == 'function') {
        result = test(sentence);
      }
      else {
        result = sentence.match(test);
      }

      if (!(result instanceof Promise)) {
        result = Promise.resolve(result);
      }

      result.then((args) => {
        if (!args) return;

        args = [].concat(args);

        handlers.forEach((handler) => {
          handler.apply(null, ...args);
        });
      })
      .catch((error) => {
        console.error(error);
      });
    });
  }

  _handleSpeechResult(e) {
    const sentence = e.results[e.results.length - 1][0].transcript.trim();
    this.trigger(sentence);
  }
}

export default SpeechListener;
