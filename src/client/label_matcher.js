import { LABEL_DEFAULT_ENDPOINT } from '../consts';
import SpeechEmitter from './speech_emitter';
import SpeechListener from './speech_listener';

let labelURL = LABEL_DEFAULT_ENDPOINT;

Object.defineProperty(matchLabel, 'labelURL', {
  configurable: true,
  enumerable: true,
  get: () => labelURL,
  set: (value) => labelURL = value
});

function createLabelMatcher(speechListener, options = {}) {
  if (speechListener == null) {
    throw TypeError('speech listener must be provided');
  }

  if (!(speechListener instanceof SpeechListener)) {
    throw TypeError('first argument must be a speech listener');
  }

  if (!(options instanceof Object)) {
    throw TypeError('options must be an object');
  }

  options = Object.assign({ labelURL }, options);

  const labelEmitter = new SpeechEmitter();
  const test = /.*/;

  const handler = (sentence) => {
    // e.g. ' ' (space) will be replaced with '%20'
    const encodedSentence = encodeURIComponent(sentence);
    const labelQueryURL = `${options.labelURL}?sentence=${encodedSentence}`;
    const request = new Request(labelQueryURL);

    fetch(request).then(response => response.json()).then(({ label }) => {
      labelEmitter.trigger(label, sentence);
    });
  };

  speechListener.on(test, handler);

  const matchLabel = (label) => {
    if (label == null) {
      throw TypeError('label must be provided');
    }

    if (typeof label != 'string') {
      throw TypeError('label must be a string');
    }

    return () => new Promise((resolve) => {
      labelEmitter.once((actualLabel, sentence) => {
        if (actualLabel == label) {
          return [[sentence, label]];
        }
      }, resolve);
    });
  };

  matchLabel.dispose = () => {
    speechListener.off(test, handler);
    labelEmitter.off();
  };

  return matchLabel;
}

export default createLabelMatcher;
