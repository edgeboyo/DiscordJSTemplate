// To add a command add it in this format:
//      - name - command's callable name
//      - description - description of the commands
//      - handler - function that handles the command with client and interaction as variables

const ping = require("./ping");

const commands = [{ name: "ping", description: "Ping command", handler: ping }];

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

function validateCommands() {
  const uniqueNames = [];

  const verificationReturn = commands.every((command) => {
    const { name, description, handler } = command;

    if (!(name instanceof String)) {
      // add check for name uniqueness
      throw new ValidationError(`${name} is not a string`);
    }

    if (uniqueNames.includes(name)) {
      throw new ValidationError(
        `${name} was used in a command before. Command names need to be unique`
      );
    }

    if (!(description instanceof String)) {
      throw new ValidationError(
        `In command ${name} - ${description} is not a string`
      );
    }

    if (!(handler instanceof Function)) {
      throw new ValidationError(
        `In command ${name} - The handler field needs to be a Function with client and interaction fields`
      );
    }

    uniqueNames.push(name);

    return true;
  });

  if (!verificationReturn) {
    throw new ValidationError("Some unspecified error happened...");
  }
}

function setCommands(client, commands) {
  const strippedCommands = commands.map((command) => {
    const { name, description } = command;

    return { name, description };
  });

  client.application.command.set(strippedCommands);
}

function setUpCommands(client) {
  setCommands(client, commands);

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    const command = commands.find(({ name }) => name == commandName);

    if (command == undefined) {
      await interaction.reply(
        "No command handler for this command provided. You might have to wait for the API to refresh."
      );
      return;
    }

    command.handler(client, interaction);
  });
}

module.exports = { setUpCommands, validateCommands };
