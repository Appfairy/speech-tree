const annyang = require('annyang');

// Default URL for fetching speech labels
// Note that this can be changed by the user, therefore we use 'let' instead of 'const'
let labelURL = '/speech-tree/label';
let labelMatchingEnabled = false;

// Fetches the belonging speech label for the provided sentence
function getSentenceLabel(sentence) {
  // e.g. ' ' (space) will be replaced with '%20'
  sentence = encodeURIComponent(sentence);
  const labelQueryURL = label + '?sentence=' + sentence;
  const request = new Request(labelURL);

  return fetch(request).then(response => response.json());
}

// In case there was no match, try to match a label to the given sentence
annyang.addCallback('resultNoMatch', [sentence], {
  // Label matching is not necessarily enabled
  if (!labelMatchingEnabled) return;

  getSentenceLabel(sentence).then((label) => {
    // Abort in case no match was found
    if (label != '__NO_MATCH__') {
      // Annotate labels with hash-tag
      annyang.trigger('#' + label);
    }
  });
});

module.exports = {
  getLabelURL: () => labelURL,
  setLabelURL: (value) => labelURL = value,
  enableLabelMatching: () => labelMatchingEnabled = true,
  disableLabelMatching: () => labelMatchingEnabled = false
};
