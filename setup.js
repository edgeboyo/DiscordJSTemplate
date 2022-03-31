const fs = require("fs");

const prompt = require("prompt-sync")();

const template = "config.json.template";

const configFile = "config.json";

let rawData = null;

try {
  rawData = fs.readFileSync(template);
} catch (e) {
  console.error("Error reading file!");
  console.error(e);
  console.error(
    `Check that ${template} is located in the project root directory!`
  );
  process.exit(1);
}

let config = null;

try {
  config = JSON.parse(rawData);
} catch (e) {
  console.error("Error processing JSON file: ");
  console.error(e);
  console.error(`Check ${template} file JSON structure`);
  process.exit(1);
}

let tokenPresent = false;

config = Object.fromEntries(
  Object.entries(config).map(([key, value]) => {
    tokenPresent = tokenPresent || key == "token";

    const type = typeof value;

    let newValue = prompt(`Value for ${key} [type: ${type}]: `);

    if (type === "number") {
      try {
        newValue = Number(type);
      } catch (e) {
        console.warn(
          `String to Number conversion failed. ${key}'s value ${value} will be saved as String`
        );
      }
    } else if (type !== "string") {
      console.warn(`Type ${type} unknown. Inputting value given as String`);
    }

    return [key, newValue];
  })
);

if (!tokenPresent) {
  console.error(
    "`token` key missing in template. The bot might not run without a bot token!"
  );
}

let data = JSON.stringify(config, null, 2);

try {
  fs.writeFileSync(configFile, data);
} catch (e) {
  console.error(`Error writing file ${configFile}`);
  console.error(e);
}

console.log(`Saved config to ${configFile}`);
