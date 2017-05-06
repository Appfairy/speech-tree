import labelMatcher from './label_matcher';
import SpeechNode from './speech_node';

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

export default rootSpeechNode;
