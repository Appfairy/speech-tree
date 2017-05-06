import boom from 'boom';
import natural from 'natural';
import pack from '../../package.json';
import { LABEL_DEFAULT_ENDPOINT, LABEL_NOT_FOUND } from '../consts';

register.attributes = {
  name: pack.name,
  version: pack.version
};

// Options:
// - path (String): The path of the registered route
// - getClassifier (Function): Required. A user-defined method which should return
//   an instance of natural.BayesClassifier
async function register(server, options, next) {
  // Apply defaults to options
  options = Object.assign({
    path: LABEL_DEFAULT_ENDPOINT
  }, options);

  if (typeof options.path != 'string') {
    return next(TypeError('path must be a string'));
  }

  if (!options.getClassifier) {
    return next(TypeError('classifier getter must be specified'));
  }

  if (typeof options.getClassifier != 'function') {
    return next(TypeError('classifier getter must be a function'));
  }

  const getClassifierResult = options.getClassifier();
  let classifierPromise = getClassifierResult;

  if (typeof getClassifierResult.then != 'function' ||
      typeof getClassifierResult.catch != 'function') {
    classifierPromise = Promise.resolve(classifierPromise);
  }

  let classifier;

  try {
    classifier = await classifierPromise();
  }
  catch (err) {
    return next(err);
  }

  if (!(classifier instanceof natural.BayesClassifier)) {
    return next(TypeError([
      'classifier getter must return either an instance of natural.BayesClassifier or',
      'an instance of Promise which returns an instance of natural.BayesClassifier'
    ].join()));
  }

  // After classifier has been trained, register route
  server.route({
    method: ['GET'],
    path: options.path,
    handler(request, reply) {
      const sentence = request.query.sentence;

      if (!sentence) {
        const error = boom.badRequest('sentence must be provided');
        return reply(error);
      }

      // Classifier might not be trained for some sentences
      try {
        const label = classifier.classify(sentence);
        reply({ label });
      }
      catch (err) {
        reply({ label: LABEL_NOT_FOUND });
      }
    }
  });

  next();
}

export default register;
