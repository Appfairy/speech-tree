import SpeechListener from './speech_listener';
import SpeechNode from './speech_node';

const speechListener = new SpeechListener();
const speechNode = new SpeechNode();
const speech = Object.assign(speechListener, speechNode);

Object.defineProperty(speech, 'labelURL', {
  configurable: true,
  enumerable: true,
  get: () => SpeechNode.labelURL,
  set: (value) => SpeechNode.labelURL = value
});

export default speech;
