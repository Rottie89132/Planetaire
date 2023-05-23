async function loadCommands(client) {
    const { loadFiles } = require("../Functions/fileloader");
    const { Perms } = require('../Validator/Permissions')
    const Ascii = require('ascii-table')
    const table = new Ascii().setHeading("Commands", "Status");
  
    await client.commands.clear();
    let commandsArray = [];
  
    const Files = await loadFiles("Commands");
    
    Files.forEach((file) => {
        const command = require(file);
        client.commands.set(command.data.name, command);
  
        if (command.permission) {
          if (Perms.includes(command.permission)) {command.defaultPermission = false;}
          else {
            return console.log(`  \x1b[32m> Commands:\x1b[0m ${command.data.name} failed to load`)
          }
        }
  
        commandsArray.push(command.data.toJSON());
      })

    client.application.commands.set(commandsArray);
    return //console.log(`  \x1b[32m> Commands:\x1b[0m loaded`);
  }
  
  module.exports = { loadCommands };
  