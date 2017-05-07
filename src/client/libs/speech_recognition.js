const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  throw Error("browser doesn't support web speech API");
}

export default SpeechRecognition;
