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
          else {return table.addRow(command.data.name, 'Ofline');
          }
        }
  
        commandsArray.push(command.data.toJSON());
        table.addRow(command.data.name, "Online");
      })

    client.application.commands.set(commandsArray);
    return console.log(table.toString())
  }
  
  module.exports = { loadCommands };
  