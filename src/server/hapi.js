import boom from 'boom';
import pack from '../../package.json';
import createSpeechClassifier from './speech_classifier';

register.attributes = {
  name: pack.name,
  version: pack.version
};

// Options:
// - path (String): The path of the registered route
// - trainer (Function): Required. A function which accepts the classifier in-order
//   to train it.
// - cacheFile (String): The path for the classifier's cache file.
// - forceTraining (Boolean): Force the training process even though a cache file is
//   available.
function register(server, options, next) {
  // Apply defaults to options
  options = Object.assign({
    path: '/speech-tree/label'
  }, options);

  if (!options.trainer) {
    throw TypeError('a trainer function must be specified');
  }

  const classifier = createSpeechClassifier(options);

  // Train classifier
  options.trainer(classifier).then(() => {
    if (!classifier._trained) {
      throw Error('classifier must be trained');
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
          reply({ label: '__NO_MATCH__' });
        }
      }
    });

    next();
  });
}

export default register;
