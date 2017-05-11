import detectPort from 'detect-port';
import express from 'express';
import speechTreeRouter from './express';

describe('Speech Tree express router', () => {
  let port;
  let url;
  let app;

  beforeEach(() => {
    return detectPort().then((...args) => {
      port = args[0];
      url = 'http://localhost:' + port;
      app = express();

      app.use(speechTreeRouter({
        classifier: (sentence) => {
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
        `${url}/speech-tree/label?sentence=hello%20world`
      );

      return fetch(request).then(response => response.json()).then(({ label }) => {
        expect(label).toEqual('helloWorld');
      });
    })
    .then(() => {
      const request = new Request(
        `${url}/speech-tree/label?sentence=foo%20bar`
      );

      return fetch(request).then(response => response.json()).then(({ label }) => {
        expect(label).toEqual('fooBar');
      });
    });
  });
});
