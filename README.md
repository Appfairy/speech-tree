# Speech Tree

Speech Tree is a utility module which aims to provide you with advanced capabilities when it comes to speech recognition in addition to the natively provided [web-speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API).

Using Speech Tree you can:

- Register events for incoming speech based on its content.
- Register a sequence of events which should follow each other in a specific order.
- Analyze a sentence using user-defined methods.
- Label a sentence against the server using a user-defined classifier.

Speech Tree is not supposed to provide you with a full robust solution, but rather an extensible one which can be changed based on the user's desires and needs.

## API

Speech Tree has provides you with client abilities, and additional server abilities, which should hook up to its client API.

Accordingly, if you would like to import Speech Tree, it should be done like so:

```js
// Import client helpers
import * as SpeechTree from 'speech-tree/client';
// Import express middleware
import SpeechTree from 'speech-tree/server/express';
// Import hapi plugin
import SpeechTree from 'speech-tree/server/hapi';
```

**Jump to:**
  - [Client](#client)
    - [Speech Listener](#speech-listener)
    - [Speech Node](#speech-node)
    - [Label Matcher](#label-matcher)
  - [Server](#server)
    - [Express Middleware](#express-middleware)
    - [Hapi Plugin](#hapi-plugin)

### Client

#### Speech Listener

**type:** class
**name:** SpeechListener

**description**:
The `SpeechListener` class is a simple wrapper around the native web-speech API and it gives you the ability to register event listeners which will invoke their belonging handlers based on incoming speech content.

**example**:
```js
import nlp from 'compromise';
import { SpeechListener } from 'speech-tree/client';

const listener = new SpeechListener({ continuous: true });

listener.on(/print (.+)/).invoke((sentence, message) => {
  console.log(message);
});

listener.on((sentence) => {
  const r = nlp(sentence);
  return r.topics().data().includes('shit') && sentence;
}, (sentence) => {
  console.log('watch your mouth young man!');
});

listener.once('stop listening').invoke(() => {
  listener.stop();
});

listener.start();
```

#### Speech Node

**type:** class
**name:** SpeechNode

**description:**
An instance of the `SpeechNode` class represents a single node in an entire tree of registered event listeners which invoke handlers in a sequence of a specific order. As we go down the events tree, all the events of the current children and their parents above will be registered. Once we invoked an event of a parent, all the events of their descending children will be disposed, living the events of current parents and their ancestors registered.

**exmaple:**
```js
import { SpeechListener, SpeechNode } from 'speech-tree/client';

const listener = new SpeechListener({ continuous: true });
const speech = new SpeechNode(listener);

speech
  .on('I would like you to show me a list')
  .or('Can you please show me a list')
  .or('I demand you to show me a list')
  .invoke((sentence) => (speech) => {
    speech
      .on('I would like you to sort the list')
      .or('Can you please sort the list')
      .or('I demand you to sort the list')
      .invoke((sentence) => {
        // ... sort list logic ...
      });

    // ... show list logic ...
  });

speech
  .on('I would like you to show me a cute picture of cats')
  .or('Can you please show me a cute picture of cats')
  .or('I demand you to show me a cute picture of cats')
  .invoke((sentence) => {
    // ... show a cute picture of cats logic ...
  });

listener.start();
```

#### Label Matcher

**type:** function
**name:** createLabelMatcher

**description:**
As soon as this function is being called, it registers an event which will start fetching labels from the server whenever there is an incoming sentence. This function returns another function, which should be used as an event tester when registering external events, to test if an incoming sentence is classified as a specified label or not.

**example:**
```js
import { SpeechListener, SpeechNode, createLabelMatcher } from 'speech-tree/client';

const listener = new SpeechListener({ continuous: true });
const matchLabel = createLabelMatcher(listener);

listener.on(matchLabel('showReport'), () => {
  // ... show report logic ...
});

listener.once('stop matching labels', () => {
  matchLabel.dispose();
});

listener.start();
```

### Server

Everything that is related to classifying sentence should be done on the server, sine such a process requires trained speech models which can classify sentences efficiently, something which requires lots of time to initialize; Therefore, training data should be stored on the server once a model has finished its training session. In addition, data can be collected from multiple users and can be stored on the server, to improve our speech model accordingly. The classification process doesn't necessarily have to be synchronous, in case it returns a promise. Currently, the route end-point for classifying sentence can be registered for [hapi](https://hapijs.com/) and [express](https://expressjs.com/) servers, besides that there aren't any future plans for more server platforms.

#### Express Middleware

**example:**
```js
import natural from 'natural';
import SpeechTree from 'speech-tree/server/express';

// ... express server initialization logic ....

const classifier = new natural.BayesClassifier();

classifier.addDocument('I would like you to show me a report', 'showReport');
classifier.addDocument('Can you please show me a report', 'showReport');
classifier.addDocument('I demand you to show me a report', 'showReport');

classifier.train();

// Route 'speech-tree/label' will be registered unless specified else wise
app.use(SpeechTree({
  classifier: classifier.classify.bind(classifier)
}));
```

#### Hapi Plugin

**example:**
```js
import natural from 'natural';
import SpeechTree from 'speech-tree/server/hapi';

// ... hapi server initialization logic ....

const classifier = new natural.BayesClassifier();

classifier.addDocument('I would like you to show me a report', 'showReport');
classifier.addDocument('Can you please show me a report', 'showReport');
classifier.addDocument('I demand you to show me a report', 'showReport');

classifier.train();

// Route 'speech-tree/label' will be registered unless specified else wise
server.register(SpeechTree({
  classifier: classifier.classify.bind(classifier)
}));
```

## Download

The source is available for download from [GitHub](http://github.com/DAB0mB/cla6). Alternatively, you can install using Node Package Manager (`npm`):

    npm install speech-tree

## License

MIT
