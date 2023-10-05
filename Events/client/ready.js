const { ActivityType } = require('discord.js');
const { loadCommands } = require("../../handlers/commandHandler")
const { loadButtons } = require("../../handlers/buttonHandler");
const { loadModals } = require("../../handlers/modalHandler");
const { loadSelection } = require("../../handlers/selectHandler");

module.exports = {
    name: "ready",
    once: "true",
    execute(client) {
      
      console.log(`\x1b[32m✔\x1b[0m Client build successfully!`)
      client.user.setActivity('/review', { type: ActivityType.Listening });
      loadCommands(client);
      loadButtons(client);
      loadModals(client);
      loadSelection(client);
      
    }
}