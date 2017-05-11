import express from 'express';
import settings from '../settings';

// Returns an express middle-ware which will register a route endpoint for handling
// labels classifications for incoming sentences
//
// Options:
//
//   - speechClassifier (Function): A sentence-to-label mapping function
//
function speechTreeAPI(options) {
  if (!options.speechClassifier) {
    throw TypeError('speech classifier must be specified');
  }

  if (typeof options.speechClassifier != 'function') {
    throw TypeError('speech classifier must be a function');
  }

  const router = express.Router();
  const apiURL = '/' + settings.apiURL.split('/').pop();

  router.get(`${apiURL}/label`, async (req, res) => {
    const sentence = req.query.sentence;

    if (!sentence) {
      res.status(400);
      return res.send('sentence must be provided');
    }

    let label = options.speechClassifier(sentence);

    if (!label) {
      res.status(404);
      return res.send('label not found');
    }

    if (typeof label.then == 'function' &&
        typeof label.catch == 'function') {
      label = await label;
    }

    if (typeof label != 'string') {
      throw TypeError('label must be a string');
    }

    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ label }));
  });

  return router;
}

export { speechTreeAPI, settings };
