import detectPort from 'detect-port';
import express from 'express';
import { speechTreeAPI, settings } from './express';

describe('Speech Tree express API', () => {
  beforeEach(() => {
    return detectPort().then((port) => {
      const app = express();
      settings.apiURL = `http://localhost:${port}/speech-tree`;

      app.use(speechTreeAPI({
        speechClassifier: (sentence) => {
          switch (sentence) {
            case 'hello world': return 'helloWorld';
            case 'foo bar': return 'fooBar';
          }
        }
      }));

      return new Promise((resolve) => {
        app.listen(port, resolve);
      });
    });
  });

  test('GET speech-tree/label', () => {
    return Promise.resolve().then(() => {
      const request = new Request(
        `${settings.apiURL}/label?sentence=hello%20world`
      );

      return fetch(request).then(response => response.json()).then(({ label }) => {
        expect(label).toEqual('helloWorld');
      });
    })
    .then(() => {
      const request = new Request(
        `${settings.apiURL}/label?sentence=foo%20bar`
      );

      return fetch(request).then(response => response.json()).then(({ label }) => {
        expect(label).toEqual('fooBar');
      });
    });
  });
});
