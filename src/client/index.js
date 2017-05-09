// Quick setup example:
//
//   const listener = new SpeechListener({ continuous: true });
//   const speech = new SpeechNode(listener);
//
//   speech
//     .on(/print (.+)/).invoke((sentence, message) => {
//       console.log(message);
//     })
//     .on('stop listening').invoke(() => {
//       listener.stop();
//     });
//
//   listener.start();
//
export { default as createLabelMatcher } from './label_matcher';
export { default as SpeechEmitter } from './speech_listener';
export { default as SpeechListener } from './speech_listener';
export { default as SpeechNode } from './speech_node';
