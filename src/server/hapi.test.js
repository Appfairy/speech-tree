import detectPort from 'detect-port';
import hapi from 'hapi';
import { speechTreeAPI, settings } from './hapi';

describe('Speech Tree hapi API', () => {
  let server;

  beforeEach(() => {
    return detectPort().then((port) => {
      const server = new hapi.Server();
      settings.apiURL = `http://localhost:${port}/speech-tree`;

      server.connection({ port });

      return server.register({
        register: speechTreeAPI,
        options: {
          speechClassifier: (sentence) => {
            switch (sentence) {
              case 'hello world': return 'helloWorld';
              case 'foo bar': return 'fooBar';
            }
          }
        }
      })
      .then(() => {
        return new Promise((resolve) => {
          server.start(resolve);
        });
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
