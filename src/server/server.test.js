import detectPort from 'detect-port';
import express from 'express';
import hapi from 'hapi';
import settings from '../settings';
import { speechTreeApi as expressSpeechTreeApi } from './express';
import { speechTreeApi as hapiSpeechTreeApi } from './hapi';

describe('Speech Tree server Api', () => {
  describe('express middle-ware', () => {
    let server;

    beforeAll(() => {
      return detectPort().then((port) => {
        const app = express();
        settings.apiUrl = `http://localhost:${port}/speech-tree`;

        app.use(expressSpeechTreeApi({
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
        settings.apiUrl = `http://localhost:${port}/speech-tree`;

        server.connection({ port });

        return server.register({
          register: hapiSpeechTreeApi,
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
          `${settings.apiUrl}/label?sentence=hello%20world`
        );

        return fetch(request).then(response => response.json()).then(({ label }) => {
          expect(label).toEqual('helloWorld');
        });
      })
      .then(() => {
        const request = new Request(
          `${settings.apiUrl}/label?sentence=foo%20bar`
        );

        return fetch(request).then(response => response.json()).then(({ label }) => {
          expect(label).toEqual('fooBar');
        });
      });
    });
  }
});
