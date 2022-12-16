async function loadButtons(client) {
  const { loadFiles } = require("../Functions/fileloader");
  const { Perms } = require('../Validator/Permissions')
  const Ascii = require('ascii-table')
  const table = new Ascii().setHeading("Buttons", "Status");

  await client.buttons.clear();
  let buttonsArray = [];

  const Files = await loadFiles("Buttons");
  
  Files.forEach((file) => {
      const button = require(file);
      client.buttons.set(button.data.CustomId, button);

      if (button.permission) {
        if (Perms.includes(button.permission)) {button.defaultPermission = false;}
        else {return table.addRow(button.data.CustomId, 'Ofline');
        }
      }

      buttonsArray.push(button.data);
      table.addRow(button.data.CustomId, "Online");
    })
  client.buttons.set(buttonsArray);
  return console.log(table.toString())
}

module.exports = { loadButtons };