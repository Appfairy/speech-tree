import SpeechRecognition from 'speech_recognition';
import SpeechEmitter from './speech_emitter';

// SpeechListener wraps the native speech recognition web API and will trigger an event
// whenever there is an incoming sentence
class SpeechListener extends SpeechEmitter {
  get listening() {
    return this._listening;
  }

  constructor(options = {}) {
    super();

    this._listening = false;
    this._speechRecognition = new SpeechRecognition();
    this._speechRecognition.continuous = options.continuous;
    this._onresult = this._handleSpeechResult.bind(this);
  }

  start() {
    this._speechRecognition.start();
    this._listening = true;
  }

  stop() {
    this._speechRecognition.stop();
    this._listening = false;
  }

  _handleSpeechResult(e) {
    const sentence = e.results[e.results.length - 1][0].transcript.trim();
    this.trigger(sentence);
  }
}

export default SpeechListener;
