async function loadSelection(client) {
  const { loadFiles } = require("../Functions/fileloader");
  const { Perms } = require('../Validator/Permissions')
  const Ascii = require('ascii-table')
  const table = new Ascii().setHeading("Select", "Status");

  await client.selects.clear();
  let selectArray = [];

  const Files = await loadFiles("Select");
  
  Files.forEach((file) => {
      const select = require(file);
      client.selects.set(select.data.CustomId, select);

      if (select.permission) {
        if (Perms.includes(button.permission)) {button.defaultPermission = false;}
        else {return table.addRow(select.data.CustomId, '🔴');
        }
      }

      selectArray.push(select.data);
      table.addRow(select.data.CustomId, "🟢");
    })
  client.selects.set(selectArray);
  return //console.log(`  \x1b[32m> Selects:\x1b[0m loaded\n`);
}

module.exports = { loadSelection };