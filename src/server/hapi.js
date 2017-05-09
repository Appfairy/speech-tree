import boom from 'boom';
import pack from '../../package.json';
import { LABEL_DEFAULT_ENDPOINT } from '../consts';

register.attributes = {
  name: pack.name,
  version: pack.version
};

// Returns hapi plug-in which will register a route endpoint for handling
// labels classifications for incoming sentences
//
// Options:
//
//   - path (String): The path of the registered route
//   - classifier (Function): A sentence-to-label mapping function
//
async function register(server, options, next) {
  options = Object.assign({
    path: LABEL_DEFAULT_ENDPOINT
  }, options);

  if (typeof options.path != 'string') {
    return next(TypeError('path must be a string'));
  }

  if (!options.classifier) {
    return next(TypeError('classifier must be specified'));
  }

  if (typeof options.classifier != 'function') {
    return next(TypeError('classifier must be a function'));
  }

  server.route({
    method: ['GET'],
    path: options.path,
    async handler(request, reply) {
      const sentence = request.query.sentence;

      if (!sentence) {
        const error = boom.badRequest('sentence must be provided');
        return reply(error);
      }

      let label = options.classifier(sentence);

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

export default register;
