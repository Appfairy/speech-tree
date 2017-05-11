import detectPort from 'detect-port';
import hapi from 'hapi';
import speechTreeRouter from './hapi';

describe('Speech Tree hapi routes', () => {
  let port;
  let url;
  let server;

  beforeEach(() => {
    return detectPort().then((...args) => {
      port = args[0];
      url = 'http://localhost:' + port;
      server = new hapi.Server();

      server.connection({ port });

      return server.register({
        register: speechTreeRouter,
        options: {
          classifier: (sentence) => {
            switch (sentence) {
              case 'hello world': return 'helloWorld';
              case 'foo bar': return 'fooBar';
            }
          }
        }
      });
    })
    .then(() => {
      return new Promise((resolve) => {
        server.start(resolve);
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
