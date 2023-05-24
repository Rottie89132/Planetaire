const { ActivityType } = require('discord.js');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const { loadCommands } = require("../../handlers/commandHandler")
const { loadButtons } = require("../../handlers/buttonHandler");
const { loadModals } = require("../../handlers/modalHandler");
const { loadSelection } = require("../../handlers/selectHandler");

module.exports = {
    name: "ready",
    once: "true",
    execute(client) {

      app.get('/status', (req, res) => {
          res.send( {status: 200, message: 'OK'});
      });

      server.listen(3000, () => {});
      
      console.log(`\x1b[32m√\x1b[0m Client build successfully!`)
      client.user.setActivity('/review', { type: ActivityType.Listening });
      loadCommands(client);
      loadButtons(client);
      loadModals(client);
      loadSelection(client);
      
    }
}