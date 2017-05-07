import annyang from 'annyang';
import SpeechNode from './speech_node';

import {
  getLabelURL,
  setLabelURL,
  enableLabelMatching,
  disableLabelMatching
} from './label_matcher';

const rootSpeechNode = new SpeechNode();

// Export annyang methods
Object.keys(annyang)
  .filter((k) => typeof annyang[k] == 'function')
  .filter((k) => rootSpeechNode[k] == null)
  .forEach((k) => rootSpeechNode[k] = annyang[k].bind(annyang));

// Export label matcher methods
Object.assign(rootSpeechNode, {
  enableLabelMatching: enableLabelMatching,
  disableLabelMatching: disableLabelMatching,
});

// Export getters and setters as native properties
Object.defineProperty(rootSpeechNode, 'labelURL', {
  configurable: true,
  enumerable: true,
  get: getLabelURL,
  set: setLabelURL
});

export default rootSpeechNode;
