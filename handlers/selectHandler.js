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
        else {return table.addRow(select.data.CustomId, 'Ofline');
        }
      }

      selectArray.push(select.data);
      table.addRow(select.data.CustomId, "Online");
    })
  client.selects.set(selectArray);
  return console.log(table.toString())
}

module.exports = { loadSelection };