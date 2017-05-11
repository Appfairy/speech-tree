import SpeechEmitter from './speech_emitter';

// An instance of the SpeechNode class represents a single node in an entire tree where
// we can register events to voice commands in sequence.
//
// Example:
//
//   - "Show me a list of all my expenses throughout the entire year"
//   - "Please sort the list"
//
class SpeechNode {
  constructor(speechEmitter, parentNode) {
    if (speechEmitter == null) {
      throw TypeError('speech emitter must be provided');
    }

    if (!(speechEmitter instanceof SpeechEmitter)) {
      throw TypeError('first argument must be a speech emitter');
    }

    if (parentNode && !(parentNode instanceof SpeechNode)) {
      throw TypeError('second argument must be a speech node');
    }

    this.speechEmitter = speechEmitter;
    this.parentNode = parentNode;
    // We can register multiple tests for a single handler. This array is used to
    // accumulate tests until their handler is being specified, in which case this array
    // pipes itself to the global tests array
    this.testsBatch = [];
    // A test-handler pairs array which will be used to register itself after the speech
    // commands map has been zeroed
    this.tests = [];

    // This is a nice chaining technique where we ensure that the user has no access to
    // functions that do not belong to the upcoming link in the sequence
    return {
      on: this.on.bind(this)
    };
  }

  on(test) {
    if (test == null) {
      throw TypeError('test must be provided');
    }

    if (!(test instanceof RegExp) &&
        typeof test != 'string' &&
        typeof test != 'function') {
      throw TypeError('test must be a regular expression, a string or a function');
    }

    // Accumulate test for the current session
    this.testsBatch.push(test);

    return {
      or: this.on.bind(this),
      invoke: this.invoke.bind(this)
    };
  }

  invoke(handler) {
    if (handler == null) {
      throw TypeError('test handler must be provided');
    }

    if (typeof handler != 'function') {
      throw TypeError('test handler must be a function');
    }

    const wrappedHandler = (...matches) => {
      // Re-register all tests of the current node and above, discarding all events
      // of child nodes
      this.speechEmitter.off();

      this.getTestsRecursively().forEach(([test, handler]) => {
        this.speechEmitter.on(test, handler);
      });

      // If the handler returns a function it means that the user would like to keep
      // building the speech tree
      const speechNodeRequest = handler(...matches);

      if (typeof speechNodeRequest != 'function') return;

      speechNodeRequest(new SpeechNode(this.speechEmitter, this));
    };

    this.testsBatch.forEach((test) => {
      this.speechEmitter.on(test, wrappedHandler);
    });

    // Compose test-handler pairs
    const testsBatch = this.testsBatch.map((test) => {
      return [test, wrappedHandler];
    });

    // Pipe tests for current session
    this.tests.push(...testsBatch);
    this.testsBatch = [];
  }

  // Gets tests of the current node and all its parents
  getTestsRecursively() {
    let parentTests;

    if (this.parentNode) {
      parentTests = this.parentNode.getTestsRecursively();
    }
    else {
      parentTests = [];
    }

    return this.tests.concat(parentTests);
  }
}

export default SpeechNode;
