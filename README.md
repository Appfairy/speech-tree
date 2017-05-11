# Speech Tree

Speech Tree is a utility module which aims to provide you with advanced capabilities when it comes to speech recognition in addition to the natively provided [web-speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API).

Using Speech Tree you can:

- Register events for incoming speech based on its content.
- Register a sequence of events which should follow each other in a specific order.
- Analyze a sentence using user-defined methods.
- Label a sentence against the server using a user-defined classifier.

Speech Tree is not supposed to provide you with a full robust solution, but rather an extensible one which can be changed based on the user's desires and needs.

## API

### SpeechEmitter() class

**description**: This is basically an event emitter, similar to Node.JS's, only it is designed specifically for speech. Usually emitted events should be whole sentences, and therefore you can also listen to these sentences by registering the right events. You can either test a match with an incoming sentence using a string, regular expression, or a custom function which receives the sentence as its first argument.

**methods**:

- `on(String|RegExp|Function, Function)` - Register a permanent event. If the provided test is a user-defined function, then the test will pass if it returned a defined value. In case an array was returned, this array will be used as an arguments vector.
- `once(String|RegExp|Function, Function)` - Same as `on`, only registers a one-time event.
- `off([String|RegExp|Function], [Function])` - Unregister an event. If no event handler function was provided, all the events which belong to the provided test will be canceled. If no arguments were provided, all events will be canceled.
- `emit(String)` - Emit an event.

**usage**:

```js
import { SpeechEmitter } from 'speech/client';

const emitter = new SpeechEmitter();

emitter.on('hello world', (sentence) => {
  assert(sentence, 'hello world');
});

emitter.on(/^hello (.+)$/, (sentence, subject) => {
  assert(sentence, 'hello world');
  assert(subject, 'world');
});

emitter.on((sentence) => {
  return sentence.match(/^hello (.+)$/);
}, (sentence, subject) => {
  assert(sentence, 'hello world');
  assert(subject, 'world');
});

emitter.emit('hello world');
```

### SpeechListener([Object]) class

**description**: A simple wrapper around the native web-speech API, which also inherits from `SpeechEmitter`, so whenever there is an incoming speech, this speech will be emitted automatically. The constructor receives an optional options object which contains the `continuous` option, which hooks up directly to the `SpeechRecognition` instance.

**methods**:

- `listening` - A getter which determines whether we are currently listening to incoming speech or not.
- `start()` - Starts recognizing speech.
- `stop()` - Stops speech recognition.

**usage**:

```js
import { SpeechListner } from 'speech/client';

const listener = new SpeechListener({ continuous: true });

listener.on('hello world', (sentence) => {
  assert(sentence, 'hello world');
});

listener.on(/^hello (.+)$/, (sentence, subject) => {
  assert(sentence, 'hello world');
  assert(subject, 'world');
});

listener.on((sentence) => {
  return sentence.match(/^hello (.+)$/);
}, (sentence, subject) => {
  assert(sentence, 'hello world');
  assert(subject, 'world');
});

listener.start();
```

### SpeechNode(SpeechEmitter) class

**description**: A single speech node represents a single node in a tree of a sequence of events which should follow one another in a specific order. This is useful if we want events to be dynamically registered and unregistered based on current state and based on previous incoming speech data. For example, we can say "show me a list", and then "sort the list", but we can't say "show me a picture of cats" and then "sort the list", that will not make sense. This is exactly the type of conflicts the speech node was meant to solve. The speech node is also useful in case we wanna register multiple tests for a single event handler.

**usage**:

Multiple tests for a single event handler:

```js
import { SpeechNode, SpeechListener } from 'speech-tree/client';

const listener = new SpeechListener();
const speech = new SpeechNode(listener);

speech
  .on('hello')
  .on('world')
.invoke((sentence) => {
  assert(sentence, /hello|world/)
});

speech
  .on('foo')
  .on('bar')
.invoke((sentence) => {
  assert(sentence, /foo|bar/)
});

listener.start();
```

Sequence of events:

```js
import { SpeechNode, SpeechListener } from 'speech-tree/client';

const listener = new SpeechListener();
const speech = new SpeechNode(listener);

speech.on('show a list').invoke(() => (speech) => {
  speech.on('sort the list').invoke(() => {
    // ... sort list logic ...
  });

  // ... show list logic ...
});

speech.on('show a picture of cats').invoke(() => (speech) => {
  // ... show a picture of cats logic ...
});

listener.start();
```

### createLabelMatcher(SpeechEmitter) function

**description**: This function receives an instance of a SpeechEmitter so it can listen to incoming speech emitted by the emitter. Whenever speech has been emitted, the label matcher will try to fetch the belonging label to the emitted speech, and if there was a match, we can invoke an event accordingly.

**returns**: matchLabel(String) function

**usage**:

```js
import { createLabelMatcher } from './speech-tree/client';

const matchLabel = createLabelMatcher(emitter);
```

### matchLabel(String) function

**description**: This function receives a string representing a speech label, and returns a testing function which will try to match incoming speech to the specified label. In case of a match, the event handler will be invoked.

**returns**: eventHandler() function

**usage**:

```js
const matchLabel = createLabelMatcher(emitter);

emitter.on(matchLabel('helloWorld'), (sentence) => {
  assert(sentence, 'I would like to say hello to the world');
});
```

### settings object

**description**: A shared settings object which ca affect the behavior of Speech Tree.

**properties**:

- `apiUrl` - A string representing the url string which will be used to connect to Speech Tree's API. Defaults to `/speech-tree`.

**usage**:

```js
import { settings } from 'speech-tree/client';

settings.apiURL = '/speech-tree';
```

or

```js
import { settings } from 'speech-tree/server/express';

settings.apiURL = '/speech-tree';
```

or

```js
import { settings } from 'speech-tree/server/hapi';

settings.apiURL = '/speech-tree';
```

### speechTreeApi

**description**: An extension which hooks up into an existing server and provides you with Speech Tree's server API. This extension receives an options object which is essential for the extension to initialize properly. This extension can be either hooked up as an Express middle-ware or a Hapi plug-in.

**options**:

- `speechClassifier(String)` - A required classifier function which receives a sentence and returns its belonging label. Essential for the label matcher to work properly.

**usage**:

Express middle-ware:

```js
import { speechTreeApi } from 'speech-tree/server/express';

const app = express();

app.use(speechTreeApi({
  speechClassifier: (sentence) => {
    switch (sentence) {
      case 'hello world': return 'helloWorld';
      case 'foo bar': return 'fooBar';
    }
  }
}));

app.listen(3000);
```

Hapi plug-in:

```js
import { speechTreeApi } from 'speech-tree/server/hapi';

const server = new hapi.Server();
server.connection({ port: 3000 });

server.register({
  register: speechTreeApi,
  options: {
    speechClassifier: (sentence) => {
      switch (sentence) {
        case 'hello world': return 'helloWorld';
        case 'foo bar': return 'fooBar';
      }
    }
  }
});

server.start();
```

## Download

The source is available for download from [GitHub](http://github.com/DAB0mB/cla6). Alternatively, you can install using Node Package Manager (`npm`):

    npm install speech-tree

## License

MIT
