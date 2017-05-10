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
    });
  });

  describe('once() method', () => {
    test('string event listeners registration', (next) => {
      emitter.once('hello world', (sentence) => {
        expect(sentence).toEqual('hello world');

        next();
      });

      emitter.emit('hello world');
    });

    test('regular expression event listeners registration', (next) => {
      emitter.once(/hello (.+)/, (sentence, subject) => {
        expect(sentence).toEqual('hello world');
        expect(subject).toEqual('world');

        next();
      });

      emitter.emit('hello world');
    });

    test('function event listeners registration', (next) => {
      emitter.once((sentence, subject) => {
        return [sentence, subject];
      }, (sentence, subject) => {
        expect(sentence).toEqual('hello world');
        expect(subject).toEqual('world');

        next();
      });

      emitter.emit('hello world', 'world');
    });

    test('async function event listeners registration', (next) => {
      emitter.once((sentence, subject) => {
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

      emitter.once('hello world', (sentence) => {
        expect(sentence).toEqual('hello world');
        time++;
      });

      emitter.once('next', () => {
        if (time == 1) next();
      });

      emitter.emit('hello world');
      emitter.emit('hello world');
      emitter.emit('next');
    });
  });

  describe('off() method', () => {
    test('handler specific event listener cancellation', (next) => {
      const test = 'hello world';
      const handler = () => next = Function();

      emitter.on(test, handler);
      emitter.on('next', next);
      emitter.off(test, handler);
      emitter.emit(test);
      emitter.emit('next');
    });

    test('test specific event listeners cancellation', (next) => {
      const test = 'hello world';
      const handler = () => next = Function();

      emitter.on(test, handler);
      emitter.on('next', next);
      emitter.off(test);
      emitter.emit(test);
      emitter.emit('next');
    });

    test('inclusive event listeners cancellation', (next) => {
      const test = 'hello world';
      const handler = () => next = Function();

      emitter.on(test, handler);
      emitter.off();
      emitter.on('next', next);
      emitter.emit(test);
      emitter.emit('next');
    });

    test('one-time event listener cancellation', (next) => {
      const test = 'hello world';
      const handler = () => next = Function();

      emitter.once(test, handler);
      emitter.on('next', next);
      emitter.off(test, handler);
      emitter.emit(test);
      emitter.emit('next');
    });
  });
});
