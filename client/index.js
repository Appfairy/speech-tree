const labelMatcher = require('./label_matcher');
const SpeechNode = require('./speech_node');

const rootSpeechNode = new SpeechNode();

Object.assign(rootSpeechNode, {
  enableLabelMatching: labelMatcher.enableLabelMatching.bind(labelMatcher),
  disableLabelMatching: labelMatcher.disableLabelMatching.bind(labelMatcher),
});

Object.defineProperty(rootSpeechNode, 'labelURL', {
  configurable: true,
  enumerable: true,
  get: labelMatcher.getLabelURL.bind(labelMatcher),
  set: labelMatcher.setLabelURL.bind(labelMatcher)
});

module.exports = rootSpeechNode;
