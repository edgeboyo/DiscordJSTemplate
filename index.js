// Require the necessary discord.js classes
const { Client, Intents } = require("discord.js");
const { setUpCommands, validateCommands } = require("./commands");
const { token } = require("./config.json");

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Ready! Validating command config!");

  validateCommands();

  console.log("Commands validated. Registering...");

  setUpCommands(client);

  console.log("Bot ready for operation.");
});

// Login to Discord with your client's token
client.login(token).catch(() => {
  console.error("Could not log in client!");
  process.exit(-100);
});
