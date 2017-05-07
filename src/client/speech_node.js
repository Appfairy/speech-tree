import { LABEL_DEFAULT_ENDPOINT, LABEL_NOT_FOUND } from '../consts';

class SpeechNode {
  static labelURL = LABEL_DEFAULT_ENDPOINT

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
    if (!test) return {
      label: this.label.bind(this)
    };

    this.testsBatch.push(test);

    return {
      or: this.on.bind(this),
      invoke: this.invoke.bind(this)
    };
  }

  label(labelName) {
    this.testsBatch.push(async (sentence) => {
      // e.g. ' ' (space) will be replaced with '%20'
      const encodedSentence = encodeURIComponent(sentence);
      const labelQueryURL = SpeechNode.labelURL + '?sentence=' + encodedSentence;
      const request = new Request(labelQueryURL);
      const response = await fetch(request).then(response => response.json());
      const label = response.label;

      if (label != LABEL_NOT_FOUND) {
        return [sentence, labelName];
      }
    });

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

      const matchesHandler = handler(...matches);

      if (typeof matchesHandler != 'function') return;

      matchesHandler(new SpeechNode(this.speechListener, this));
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
