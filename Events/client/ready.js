const { ActivityType } = require('discord.js');
const { loadCommands } = require("../../handlers/commandHandler")
const { loadButtons } = require("../../handlers/buttonHandler");
const { loadModals } = require("../../handlers/modalHandler");
const { loadSelection } = require("../../handlers/selectHandler");

module.exports = {
    name: "ready",
    once: "true",
    execute(client)
    {
      console.log(`${client.user.tag} is logged in`)

      client.user.setActivity('/review', { type: ActivityType.Listening });
      loadCommands(client);
      loadButtons(client);
      loadModals(client);
      loadSelection(client);
      
    }
}