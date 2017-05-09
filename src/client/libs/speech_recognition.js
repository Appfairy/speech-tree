// A simple wrapped around the native speech recognition class which if our browser
// runs webkit or not, and will give us the right class accordingly. If the current
// version of the browser doesn't support speech recognition (natively), an error
// will be thrown
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  throw Error("browser doesn't support web speech API");
}

export default SpeechRecognition;
