import express from 'express';
import createSpeechClassifier from './speech_classifier';

let classifier;

// Options:
// - trainer (Function): Required. A function which accepts the classifier in-order
//   to train it.
// - cacheFile (String): The path for the classifier's cache file.
// - forceTraining (Boolean): Force the training process even though a cache file is
//   available.
export function trainClassifier(options) {
  if (!options.trainer) {
    throw TypeError('a trainer function must be specified');
  }

  return (req, res, next) => {
    if (classifier) return next();

    classifier = createSpeechClassifier();

    options.trainer(classifier).then(() => {
      if (classifier._trained) {
        next();
      }
      else {
        next(Error('classifier must be trained'));
      }
    });
  };
}

// Options:
// - url (String): The url of the registered route
export function matchLabel(options) {
  // Apply defaults to options
  options = Object.assign({
    url: '/speech-tree/label'
  }, options);

  const router = express.Router();

  router.get(options.url, (req, res) => {
    if (!classifier) {
      return next(Error('classifier must be trained'));
    }

    const sentence = req.query.sentence;

    if (!sentence) {
      res.status(400);
      return res.send('sentence must be provided');
    }

    res.status(200);
    res.setHeader('Content-Type', 'application/json');

    // Classifier might not be trained for some sentences
    try {
      const label = classifier.classify(sentence);
      res.send(JSON.stringify({ label }));
    }
    catch (err) {
      res.send(JSON.stringify({ label: '__NO_MATCH__' }));
    }
  });
}
