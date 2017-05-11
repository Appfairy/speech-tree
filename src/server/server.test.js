import detectPort from 'detect-port';
import express from 'express';
import hapi from 'hapi';
import settings from '../settings';
import { speechTreeAPI as expressSpeechTreeAPI } from './express';
import { speechTreeAPI as hapiSpeechTreeAPI } from './hapi';

describe('Speech Tree server API', () => {
  describe('express middle-ware', () => {
    let server;

    beforeAll(() => {
      return detectPort().then((port) => {
        const app = express();
        settings.apiURL = `http://localhost:${port}/speech-tree`;

        app.use(expressSpeechTreeAPI({
          speechClassifier: (sentence) => {
            switch (sentence) {
              case 'hello world': return 'helloWorld';
              case 'foo bar': return 'fooBar';
            }
          }
        }));

        return new Promise((resolve) => {
          server = app.listen(port, resolve);
        });
      });
    });

    afterAll(() => {
      server.close();
    });

    registerTests();
  });

  describe('hapi plug-in', () => {
    let server;

    beforeAll(() => {
      return detectPort().then((port) => {
        server = new hapi.Server();
        settings.apiURL = `http://localhost:${port}/speech-tree`;

        server.connection({ port });

        return server.register({
          register: hapiSpeechTreeAPI,
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

    afterAll(() => {
      server.stop();
    });

    registerTests();
  });

  function registerTests() {
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
  }
});
