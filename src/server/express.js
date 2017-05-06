import express from 'express';
import natural from 'natural';
import { LABEL_DEFAULT_ENDPOINT, LABEL_NOT_FOUND } from '../consts';

let classifier;

// First, we need to initialize the classifier
export function getClassifier(handler) {
  if (!handler) {
    throw TypeError('handler must be specified');
  }

  if (typeof handler != 'function') {
    throw TypeError('handler must be a function');
  }

  return async (req, res, next) => {
    if (classifier) return next();

    const result = handler();
    let classifierPromise = result;

    if (typeof result.then != 'function' ||
        typeof result.catch != 'function') {
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
  };
}

// Then, we can register the route
export function matchLabel(url = LABEL_DEFAULT_ENDPOINT) {
  if (typeof options.path != 'string') {
    throw TypeError('path must be a string');
  }

  const router = express.Router();

  // After classifier has been trained, register route
  router.get(url, (req, res) => {
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
      res.send(JSON.stringify({ label: LABEL_NOT_FOUND }));
    }
  });

  return router;
}
