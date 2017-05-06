import annyang from 'annyang';
import { LABEL_DEFAULT_ENDPOINT, LABEL_NOT_FOUND } from'../consts';

// Default URL for fetching speech labels
// Note that this can be changed by the user, therefore we use 'let' instead of 'const'
let labelURL = LABEL_DEFAULT_ENDPOINT;
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
annyang.addCallback('resultNoMatch', [sentence], () => {
  // Label matching is not necessarily enabled
  if (!labelMatchingEnabled) return;

  getSentenceLabel(sentence).then((label) => {
    // Abort in case no match was found
    if (label != LABEL_NOT_FOUND) {
      // Annotate labels with hash-tag
      annyang.trigger('#' + label);
    }
  });
});

export const getLabelURL = () => labelURL;
export const setLabelURL = (value) => labelURL = value;
export const enableLabelMatching = () => labelMatchingEnabled = true;
export const disableLabelMatching = () => labelMatchingEnabled = false;
