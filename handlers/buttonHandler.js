async function loadButtons(client) {
  const { loadFiles } = require("../Functions/fileloader");
  const { Perms } = require('../Validator/Permissions')

  client.buttons = new Map()
  const buttonsArray = new Array();
  const buttons = new Array();

  const files = await loadFiles("Buttons");
  
  files.forEach((file) => {
      const button = require(file);
      client.buttons.set(button.data.CustomId, button);

      if (button.permission) {
        if (Perms.includes(button.permission)) {button.defaultPermission = false;}
        else {
          return buttons.push({Name: button.data.CustomId, Status: "Ofline"});
        }
      }

      buttonsArray.push(button.data);
      buttons.push({Name: button.data.CustomId, Status: "Online"})
      
    })
  client.buttons.set(buttonsArray);
  return //console.log(`  \x1b[32m> Buttons:\x1b[0m loaded`);
}

module.exports = { loadButtons };