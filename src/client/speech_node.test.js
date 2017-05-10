import after from 'lodash.after';
import SpeechEmitter from './speech_emitter';
import SpeechNode from './speech_node';

let emitter;
let speech;

describe('SpeechNode() class', () => {
  beforeEach(() => {
    emitter = new SpeechEmitter();
    speech = new SpeechNode(emitter);
  });

  test('event listener with multiple tests registration', (next) => {
    let time = 0;

    speech
      .on('hello')
      .or('world')
    .invoke((sentence) => {
      switch (time++) {
        case 0: expect(sentence).toEqual('hello'); break;
        case 1: expect(sentence).toEqual('world'); break;
      }
    });

    speech
      .on('foo')
      .or('baz')
    .invoke((sentence) => {
      switch (time++) {
        case 2: expect(sentence).toEqual('foo'); break;
        case 3: expect(sentence).toEqual('bar'); break;
      }
    });

    speech.on('next').invoke(() => {
      if (time == 3) next();
    });

    emitter.emit('hello');
    emitter.emit('world');
    emitter.emit('foo');
    emitter.emit('bar');
    emitter.emit('next');
  });

  test('a specific sequence of event listeners registration', (next) => {
    let time = 0;

    setTimeout(() => {
      emitter.emit('sort list');
      emitter.emit('show element');
      emitter.emit('sort list');
    });

    speech.on('show list').invoke(() => (speech) => {
      setTimeout(() => {
        emitter.emit('sort list');
      });

      speech.on('sort list').invoke(() => {
        if (time == 2) next();
      });

      time++;
    });

    speech.on('show element').invoke(() => {
      setTimeout(() => {
        emitter.emit('sort list');
        emitter.emit('show list');
      });

      time++;
    });
  });
});
