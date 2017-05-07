import annyang from 'annyang';

let methodCounter = 0;
let nlp;
let proto;

// This is a bulk operation build for natural language processing.
// It receivers the node from which it was called from and an array of operations
// which should be aggregated as we define more bulk operations
export function buildBulkOperaion(node, operations = []) {
  if (!nlp) {
    throw Error('compromise must be initialized');
  }

  const chain = {};

  // Returns a property value
  chain.at = (method) => {
    operations.push({ method });
    return buildBulkOperaion(node, operations);
  };

  // Finishes the bulk operation by comparing the result to the sentence and registering
  // the necessary callbacks to annyang
  chain.equals = (result) => {
    const id = methodCounter++;
    const tag = `__nlp${id}__`;

    annyang.addCallback('resultNoMatch', ([sentence]) => {
      // This is where we invoke all our bulk operation
      const result = operations.reduce((text, { method, args }) => {
        if (args) {
          return text[method](...args);
        }

        return text[method];
      }, nlp(sentence));

      if (result == sentence) {
        annyang.trigger(`__nlp${id}__`);
      }
    });

    return node.on(tag);
  };

  const recentMethod = operations[operations.length - 1].method;

  // These three methods don't return an nlp wrapper
  if (!['at', 'data', 'out'].includes(recentMethod)) {
    Object.keys(proto.prototype)
      .filter(k => typeof proto.prototype[k] == 'function')
      .forEach(method => {
        chain[method] = (...args) => {
          operations.push({ method, args });
          return buildBulkOperaion(node, operations);
        };
      });
  }

  return chain;
}

// The bulk operator relies on the 'compromise' library for natural language processing.
// This is optional for the simple reason that not every user is interested in such
// functionality, therefore we can save ourselves some heavy-script loading
export const setCompromise = (lib) => {
   nlp = lib;
   proto = nlp().__proto__;
}
