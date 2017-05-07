import annyang from 'annyang';
import { buildBulkOperaion } from './bulk_operator';

class SpeechNode {
  constructor(parentNode) {
    this.parentNode = parentNode;
    this.commandNamesBatch = [];
    this.commands = {};

    return {
      on: this.on.bind(this)
    };
  }

  on(commandName) {
    if (!commandName) {
      return buildBulkOperaion(this);
    }

    if (typeof commandName != 'string') {
      throw TypeError('command name must be an instance of string');
    }

    this.commandNamesBatch.push(commandName);

    return {
      on: this.on.bind(this),
      invoke: this.invoke.bind(this)
    };
  }

  invoke(commandHandler) {
    if (!commandHandler) {
      throw TypeError('command handler must be provided');
    }

    if (typeof commandHandler != 'function') {
      throw TypeError('command handler must be a function');
    }

    const wrappedCommandHandler = (...matches) => {
      annyang.init(this.commands);

      const matchesHandler = commandHandler(...matches);

      if (typeof matchesHandler != 'function') return;

      matchesHandler(new SpeechNode(this));
    };

    const commandsBatch = this.commandNamesBatch.reduce((commandsBatch, commandName) => {
      commandsBatch[commandName] = wrappedCommandHandler;
      return commandsBatch;
    }, {});

    Object.assign(this.commands, commandsBatch);

    annyang.addCommands(this.commands);

    this.commandsBatch = [];

    return {
      on: this.on.bind(this)
    };
  }

  getCommandsRecursively() {
    let parentCommands;

    if (this.parentNode) {
      parentCommands = this.parentNode.getCommandsRecursively();
    }
    else {
      parentCommands = {};
    }

    return Object.assign(parentCommands, this.commands);
  }
}

export default SpeechNode;
