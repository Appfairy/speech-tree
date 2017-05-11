import nock from 'nock';
import settings from '../settings';
import createLabelMatcher from './label_matcher';
import SpeechEmitter from './speech_emitter';

settings.apiURL = 'http://localhost:3000/speech-tree';

describe.only('createLabelMatcher() function', () => {
  let server;
  let emitter;
  let matchLabel;

  beforeEach(() => {
    emitter = new SpeechEmitter();
    matchLabel = createLabelMatcher(emitter);
    server = nock(settings.apiURL);
  });

  afterEach(() => {
    matchLabel.dispose();
    nock.restore();
  });

  test('label matching', (next) => {
    server
      .get('/label')
      .query({ sentence: 'I am saying hello to the world' })
      .reply(200, { label: 'helloWorld' });

    server
      .get('/label')
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
