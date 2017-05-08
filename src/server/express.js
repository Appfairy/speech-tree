import express from 'express';
import { LABEL_DEFAULT_ENDPOINT } from '../consts';

function middleware(options) {
  // Apply defaults to options
  options = Object.assign({
    url: LABEL_DEFAULT_ENDPOINT
  }, options);

  if (typeof options.url != 'string') {
    return next(TypeError('url must be a string'));
  }

  if (!options.classifier) {
    return next(TypeError('classifier must be specified'));
  }

  if (typeof options.classifier != 'function') {
    return next(TypeError('classifier must be a function'));
  }

  const router = express.Router();

  // After classifier has been trained, register route
  router.get(url, async (req, res) => {
    const sentence = req.query.sentence;

    if (!sentence) {
      res.status(400);
      return res.send('sentence must be provided');
    }

    let label = options.classifier(sentence);

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

export default middleware;
