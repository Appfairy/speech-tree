import { LABEL_DEFAULT_ENDPOINT } from '../consts';
import { SpeechListener } from './speech_listener';

class SpeechNode {
  constructor(speechListener, parentNode) {
    if (speechListener == null) {
      throw TypeError('speech listener must be provided');
    }

    if (!(speechListener instanceof SpeechListener)) {
      throw TypeError('first argument must be a speech listener');
    }

    if (parentNode && !(parentNode instanceof SpeechNode)) {
      throw TypeError('second argument must be a speech node');
    }

    this.speechListener = speechListener;
    this.parentNode = parentNode;
    this.testsBatch = [];
    this.tests = [];

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
      this.speechListener.off();
      this.speechListener.on(this.getTestsRecursively());

      const speechNodeRequest = handler(...matches);

      if (typeof speechNodeRequest != 'function') return;

      speechNodeRequest(new SpeechNode(this.speechListener, this));
    };

    this.speechListener.on(this.testsBatch, wrappedHandler);

    const testsBatch = this.testsBatch.map((test) => {
      return [test, handler];
    });

    this.tests.push(...testsBatch);
    this.testsBatch = [];

    return {
      on: this.on.bind(this)
    };
  }

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
