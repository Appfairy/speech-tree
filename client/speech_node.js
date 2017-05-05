const annyang = require('annyang');

class SpeechNode {
  constructor() {
    this.commandNamesBatch = [];
    this.commands = {};

    return {
      on: this.on.bind(this)
    };
  }

  on(commandName) {
    if (!commandName) {
      throw TypeError('command name must be provided');
    }

    if (typeof commandName != 'string') {
      throw TypeError('command name must be an instance of string');
    }

    this.commandNamesBatch.push(commandName);

    return {
      or: this.on.bind(this),
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

      matchesHandler(new SpeechNode());
    };

    const commandsBatch = this.commandNamesBatch.reduce((commandsBatch, commandName) => {
      commandsBatch[commandName] = wrappedCommandHandler;
      return commandsBatch;
    }, {});

    Object.assign(this.commands, this.commandsBatch);

    annyang.addCommands(this.commands);

    this.commandsBatch = [];

    return {
      on: this.on.bind(this)
    };
  }
}

module.exports = rootSpeechNode;
