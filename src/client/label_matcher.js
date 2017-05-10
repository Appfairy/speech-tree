import { LABEL_DEFAULT_ENDPOINT } from '../consts';
import SpeechEmitter from './speech_emitter';

// This module can generate tester functions which will validate incoming sentences
// against a label which can be fetched from the server using the provided plug-ins.
// This is useful because it implements a complicated logic in an efficient way, and it
// makes the classification process much easier to hook up with the client.
//
// Example:
//
//   const matchLabel = createLabelMatcher(listener);
//
//   speech.on(matchLabel('print')).invoke((sentence) => {
//     console.log(sentence);
//   });
//
let labelURL = LABEL_DEFAULT_ENDPOINT;

Object.defineProperty(createLabelMatcher, 'labelURL', {
  configurable: true,
  enumerable: true,
  get: () => labelURL,
  set: (value) => labelURL = value
});

// This will start listening for incoming sentences and will fetch labels from the server
// each time a speech was recognized. It will return a factory function which will
// generate an event handler for testing sentences against fetched labels
function createLabelMatcher(speechEmitter, options = {}) {
  if (speechEmitter == null) {
    throw TypeError('speech emitter must be provided');
  }

  if (!(speechEmitter instanceof SpeechEmitter)) {
    throw TypeError('first argument must be a speech emitter');
  }

  if (!(options instanceof Object)) {
    throw TypeError('options must be an object');
  }

  options = Object.assign({ labelURL }, options);

  // This will be used to register events for fetched labels
  const labelEmitter = new SpeechEmitter();
  const sentencePattern = /.*/;

  // This will fetch labels and emit them whenever there is an incoming sentence
  const fetchHandler = (sentence) => {
    // e.g. ' ' (space) will be replaced with '%20'
    const encodedSentence = encodeURIComponent(sentence);
    const labelQueryURL = `${options.labelURL}?sentence=${encodedSentence}`;
    const request = new Request(labelQueryURL);

    fetch(request).then(response => response.json()).then(({ label }) => {
      labelEmitter.emit(label, sentence);

      // Re-register event listener after it (could have been) zeroed by the speech node.
      // Here we wait run the registration in the next event loop to ensure all promises
      // have been resolved
      setTimeout(() => {
        speechEmitter.once(sentencePattern, fetchHandler);
      });
    })
    .catch((error) => {
      console.error(error);
    });
  };

  // Here we use the once() method and not the on() method we re-register the event
  // listener once a fetch has been done
  speechEmitter.once(sentencePattern, fetchHandler);

  // A factory function which will generate an event handler for matching sentences
  // against fetched labels. Be sure to call the dispose() method once you don't need
  // the labels logic anymore! Otherwise requests will keep being made to the server
  // in the background
  const matchLabel = (label) => {
    if (label == null) {
      throw TypeError('label must be provided');
    }

    if (typeof label != 'string') {
      throw TypeError('label must be a string');
    }

    // An async event handler which returns a promise
    return () => new Promise((resolve) => {
      // The promise will resolve itself whenever an emitted label matches the
      // expected label
      const labelTest = (actualLabel, sentence) => {
        // This makes it a one-time test
        labelEmitter.off(labelTest);

        if (actualLabel == label) {
          // These are the arguments with whom the event handler will be invoked with
          return [sentence, label];
        }
      };

      labelEmitter.on(labelTest, resolve);
    });
  };

  // The disposal methods disposes all the registered label events and it stops the
  // auto-fetching to the server whenever there is an incoming sentence
  matchLabel.dispose = () => {
    speechEmitter.off(sentencePattern, fetchHandler);
    labelEmitter.off();
  };

  return matchLabel;
}

export default createLabelMatcher;
