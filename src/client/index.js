import annyang from 'annyang';
import labelMatcher from './label_matcher';
import SpeechNode from './speech_node';

const rootSpeechNode = new SpeechNode();

// Export annyang methods
Object.keys(annyang)
  .filter((k) => typeof annyang[k] == 'function')
  .forEach((k) => rootSpeechNode[k] = annyang[k].bind(annyang));

// Export label matcher methods
Object.assign(rootSpeechNode, {
  enableLabelMatching: labelMatcher.enableLabelMatching.bind(labelMatcher),
  disableLabelMatching: labelMatcher.disableLabelMatching.bind(labelMatcher),
});

// Export getters and setters as native properties
Object.defineProperty(rootSpeechNode, 'labelURL', {
  configurable: true,
  enumerable: true,
  get: labelMatcher.getLabelURL.bind(labelMatcher),
  set: labelMatcher.setLabelURL.bind(labelMatcher)
});

export default rootSpeechNode;
