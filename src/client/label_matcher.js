import { LABEL_DEFAULT_ENDPOINT } from '../consts';
import SpeechEmitter from './speech_emitter';
import SpeechListener from './speech_listener';

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

  // This will be used to register events for fetched labels
  const labelEmitter = new SpeechEmitter();
  const test = /.*/;

  // This will fetch labels and trigger them whenever there is an incoming sentence
  const handler = (sentence) => {
    // e.g. ' ' (space) will be replaced with '%20'
    const encodedSentence = encodeURIComponent(sentence);
    const labelQueryURL = `${options.labelURL}?sentence=${encodedSentence}`;
    const request = new Request(labelQueryURL);

    fetch(request).then(response => response.json()).then(({ label }) => {
      labelEmitter.trigger(label, sentence);

      // Re-register event listener after it (could have been) zeroed by the speech node.
      // Here we wait run the registration in the next event loop to ensure all promises
      // have been resolved
      setTimeout(() => {
        speechListener.once(test, handler);
      });
    });
  };

  // Here we use the once() method and not the on() method we re-register the event
  // listener once a fetch has been done
  speechListener.once(test, handler);

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
      // expected label.
      // TODO: We can force memory leak by removing the label matcher event listener
      // leaving the event listener above still registered. This should be fixed in the
      // future
      labelEmitter.once((actualLabel, sentence) => {
        if (actualLabel == label) {
          // These are the arguments with whom the event handler will be invoked with
          return [[sentence, label]];
        }
      }, resolve);
    });
  };

  // The disposal methods disposes all the registered label events and it stops the
  // auto-fetching to the server whenever there is an incoming sentence
  matchLabel.dispose = () => {
    speechListener.off(test, handler);
    labelEmitter.off();
  };

  return matchLabel;
}

export default createLabelMatcher;
