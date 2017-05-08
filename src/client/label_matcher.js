import { LABEL_DEFAULT_ENDPOINT, LABEL_NOT_FOUND } from '../consts';

let labelURL = LABEL_DEFAULT_ENDPOINT;

Object.defineProperty(matchLabel, 'labelURL', {
  configurable: true,
  enumerable: true,
  get: () => labelURL,
  set: (value) => labelURL = value
});

function matchLabel(expectedLabel, options) {
  options = Object.assign({ labelURL }, options);

  return (sentence) => {
    // e.g. ' ' (space) will be replaced with '%20'
    const encodedSentence = encodeURIComponent(sentence);
    const labelQueryURL = `${options.labelURL}?sentence=${encodedSentence}`;
    const request = new Request(labelQueryURL);

    fetch(request).then(response => response.json()).then(({ label }) => {
      if (label == expectedLabel) {
        return [sentence, label];
      }
    });
  };
}

export default matchLabel;
