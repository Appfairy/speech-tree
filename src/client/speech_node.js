import { LABEL_DEFAULT_ENDPOINT, LABEL_NOT_FOUND } from '../consts';

class SpeechNode {
  constructor(speechListener, parentNode) {
    this.speechListener = speechListener;
    this.parentNode = parentNode;
    this.testsBatch = [];
    this.tests = [];

    return {
      on: this.on.bind(this)
    };
  }

  on(test) {
    this.testsBatch.push(test);

    return {
      or: this.on.bind(this),
      invoke: this.invoke.bind(this)
    };
  }

  invoke(handler) {
    if (!handler) {
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
