async function loadModals(client) {
  const { loadFiles } = require("../Functions/fileloader");
  const { Perms } = require('../Validator/Permissions')
  const Ascii = require('ascii-table')
  const table = new Ascii().setHeading("Modals", "Status");

  await client.modals.clear();
  let modalsArray = [];

  const Files = await loadFiles("Modals");
  
  Files.forEach((file) => {
      const modal = require(file);
      client.modals.set(modal.data.CustomId, modal);

      if (modal.permission) {
        if (Perms.includes(modal.permission)) {modal.defaultPermission = false;}
        else {return table.addRow(modal.data.CustomId, '🔴');
        }
      }

      modalsArray.push(modal.data);
      table.addRow(modal.data.CustomId, "🟢");
    })
  
  client.buttons.set(modalsArray);
  return //console.log(`  \x1b[32m> modals:\x1b[0m loaded`);
}

module.exports = { loadModals };