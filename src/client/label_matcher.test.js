import nock from 'nock';
import createLabelMatcher from './label_matcher';
import SpeechEmitter from './speech_emitter';

describe('createLabelMatcher() function', () => {
  let server;
  let emitter;
  let matchLabel;
  let url = 'http://localhost:3000';

  beforeEach(() => {
    emitter = new SpeechEmitter();
    matchLabel = createLabelMatcher(emitter, { labelURL: `${url}/speech-tree/label` });
    server = nock(url);
  });

  afterEach(() => {
    matchLabel.dispose();
    nock.restore();
  });

  test('label matching', (next) => {
    server
      .get('/speech-tree/label')
      .query({ sentence: 'I am saying hello to the world' })
      .reply(200, { label: 'helloWorld' });

    server
      .get('/speech-tree/label')
      .query({ sentence: 'I would like to foo a bar' })
      .reply(200, { label: 'fooBar' });

    emitter.on(matchLabel('helloWorld'), () => {
      setTimeout(() => {
        emitter.emit('I would like to foo a bar');
      });
    });

    emitter.on(matchLabel('fooBar'), () => {
      next();
    });

    emitter.emit('I am saying hello to the world');
  });
});
