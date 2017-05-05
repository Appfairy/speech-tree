const express = require('express');
const createSpeechClassifier = require('./speech_classifier');

function createMiddleware(options) {
  // Apply defaults to options
  options = Object.assign({
    url: '/speech-tree/label'
  }, options);

  if (!options.trainer) {
    throw TypeError('a trainer function must be specified');
  }

  const classifier = createSpeechClassifier(options);

  // Train classifier
  return options.trainer(classifier).then(() => {
    if (!classifier._trained) {
      throw Error('classifier must be trained');
    }

    // After we've finished initializing all our logic, we finally return the middleware
    return (req, res, next) => {
      if (req.method != 'get') return next();
      if (req.url != options.url) return next();

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
        res.send(JSON.stringify({ label: 'notTrained' }));
      }
    };
  });
}

module.exports = createMiddleware;
