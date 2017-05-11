import boom from 'boom';
import pack from '../../package.json';
import settings from '../settings';

speechTreeApi.attributes = {
  name: pack.name,
  version: pack.version
};

// Returns hapi plug-in which will register a route endpoint for handling
// labels classifications for incoming sentences
//
// Options:
//
//   - speechClassifier (Function): A sentence-to-label mapping function
//
async function speechTreeApi(server, options, next) {
  if (!options.speechClassifier) {
    return next(TypeError('speech classifier must be specified'));
  }

  if (typeof options.speechClassifier != 'function') {
    return next(TypeError('speech classifier must be a function'));
  }

  const apiUrl = '/' + settings.apiUrl.split('/').pop();

  server.route({
    method: ['GET'],
    path: `${apiUrl}/label`,
    async handler(request, reply) {
      const sentence = request.query.sentence;

      if (!sentence) {
        const error = boom.badRequest('sentence must be provided');
        return reply(error);
      }

      let label = options.speechClassifier(sentence);

      if (!label) {
        const error = boom.notFound('label not found');
        return reply(error);
      }

      if (typeof label.then == 'function' &&
          typeof label.catch == 'function') {
        label = await label;
      }

      if (typeof label != 'string') {
        throw TypeError('label must be a string');
      }

      reply({ label });
    }
  });

  next();
}

export { speechTreeApi, settings };
