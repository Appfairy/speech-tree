const fs = require('fs');
const natural = require('natural');
const path = require('path');

function createSpeechClassifier(options) {
  // Resolve relative cache file path to cwd
  const cacheFile = options.cacheFile && path.resolve(process.cwd(), options.cacheFile);

  // Check if cache file exists
  try {
    var cacheFileExists = cacheFile && !!fs.stat(cacheFile);
  }
  catch (err) {
    var cacheFileExists = false;
  }

  // If cache file specified and it exists -
  // Restore classifier from cache file
  if (!options.forceTraining && cacheFile && cacheFileExists) {
    cacheFile = path.resolve(process.cwd(), cacheFile);
    const cacheJSON = require(cacheFile);
    const classifier = natural.BayesClassifier.restore(cacheJSON);

    // Define dummy methods so we won't need to have any special treatments
    classifier.addDocument = Function();

    classifier.train = () => {
      classifier._trained = true;
      return Promise.resolve();
    };
  }
  // Else -
  // Create a new classifier and train it
  else {
    const classifier = new natural.BayesClassifier();
    const train = classifier.train;

    // After training has finished, store the classifier in cache
    classifier.train = () => new Promise((resolve, reject) => {
      classifier._trained = true;
      train.call(classifier);

      // If cache file was not provided, abort the process
      if (!cacheFile) return resolve();

      classifier.save(cacheFile, (err) => {
        if (err)
          reject(err);
        else
          resolve();
      });
    });
  }
}

module.exports = createSpeechClassifier;
