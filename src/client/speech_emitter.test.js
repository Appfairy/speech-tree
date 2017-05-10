import SpeechEmitter from './speech_emitter';

describe('SpeechEmitter() class', () => {
  let emitter;

  beforeEach(() => {
    emitter = new SpeechEmitter();
  });

  describe('on() method', () => {
    test('string event listeners registration', (next) => {
      emitter.on('hello world', (sentence) => {
        expect(sentence).toEqual('hello world');

        next();
      });

      emitter.emit('hello world');
    });

    test('regular expression event listeners registration', (next) => {
      emitter.on(/hello (.+)/, (sentence, subject) => {
        expect(sentence).toEqual('hello world');
        expect(subject).toEqual('world');

        next();
      });

      emitter.emit('hello world');
    });

    test('function event listeners registration', (next) => {
      emitter.on((sentence, subject) => {
        return [sentence, subject];
      }, (sentence, subject) => {
        expect(sentence).toEqual('hello world');
        expect(subject).toEqual('world');

        next();
      });

      emitter.emit('hello world', 'world');
    });

    test('async function event listeners registration', (next) => {
      emitter.on((sentence, subject) => {
        return Promise.resolve([sentence, subject]);
      }, (sentence, subject) => {
        expect(sentence).toEqual('hello world');
        expect(subject).toEqual('world');

        next();
      });

      emitter.emit('hello world', 'world');
    });

    test('permanent event listener registration', (next) => {
      let time = 0;

      emitter.on('hello world', (sentence) => {
        expect(sentence).toEqual('hello world');

        if (time++) {
          next();
        }
      });

      emitter.emit('hello world');
      emitter.emit('hello world');

      if (!time) {
        next(Error('event handler should have been called multiple times'));
      }
    });
  });

  describe('once() method', () => {
    test('string event listeners registration', (next) => {
      emitter.on('hello world', (sentence) => {
        expect(sentence).toEqual('hello world');

        next();
      });

      emitter.emit('hello world');
    });

    test('regular expression event listeners registration', (next) => {
      emitter.on(/hello (.+)/, (sentence, subject) => {
        expect(sentence).toEqual('hello world');
        expect(subject).toEqual('world');

        next();
      });

      emitter.emit('hello world');
    });

    test('function event listeners registration', (next) => {
      emitter.on((sentence, subject) => {
        return [sentence, subject];
      }, (sentence, subject) => {
        expect(sentence).toEqual('hello world');
        expect(subject).toEqual('world');

        next();
      });

      emitter.emit('hello world', 'world');
    });

    test('async function event listeners registration', (next) => {
      emitter.on((sentence, subject) => {
        return Promise.resolve([sentence, subject]);
      }, (sentence, subject) => {
        expect(sentence).toEqual('hello world');
        expect(subject).toEqual('world');

        next();
      });

      emitter.emit('hello world', 'world');
    });

    test('one-time event listener registration', (next) => {
      let time = 0;

      emitter.on('hello world', (sentence) => {
        expect(sentence).toEqual('hello world');

        if (time++) {
          next(Error('event handler should have been called one-time only'));
        }
      });

      emitter.emit('hello world');
      emitter.emit('hello world');

      next();
    });
  });

  describe('off() method', () => {
    test('handler specific event listener cancellation', () => {
      const test = 'hello world';
      const handler = () => {
        throw Error('handler should not have been called');
      };

      emitter.on(test, handler);
      emitter.off(test, handler);
      emitter.emit(test);
    });

    test('test specific event listeners cancellation', () => {
      const test = 'hello world';
      const handler = () => {
        throw Error('handler should not have been called');
      };

      emitter.on(test, handler);
      emitter.off(test);
      emitter.emit(test);
    });

    test('inclusive event listeners cancellation', () => {
      const test = 'hello world';
      const handler = () => {
        throw Error('handler should not have been called');
      };

      emitter.on(test, handler);
      emitter.off();
      emitter.emit(test);
    });

    test('one-time event listener cancellation', () => {
      const test = 'hello world';
      const handler = () => {
        throw Error('handler should not have been called');
      };

      emitter.once(test, handler);
      emitter.off(test, handler);
      emitter.emit(test);
    });
  });
});
