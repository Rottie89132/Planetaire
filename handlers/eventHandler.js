const { loadFiles } = require("../Functions/fileloader");

async function loadEvents(client) {
  console.time(`\x1b[32m√\x1b[0m Events loaded in`)
    
  client.events = new Map()
  const events = new Array()
  const files = await loadFiles("Events");

  for (const file of files) {
    try {
      const event = require(file);
      const execute = (...args) => event.execute(...args, client);
      const target = event.rest ? client.rest : client;

      target[event.once ? "once" : "on"](event.name, execute);
      client.events.set(event.name, execute);

      events.push({Name: event.name, Status: "Online"})

    } catch (err) {
      events.push({Name: file.split("/").pop().slice(0, -3), Status: "Ofline"})
    }
  }

  //console.clear();
  console.timeEnd('\x1b[32m√\x1b[0m Events loaded in'); console.log();

  for (const item of events) {
    console.log(`  \x1b[${item.Status === 'Online' ? '32' : '31'}m> ${item.Status === 'Online' ? 'Event' : 'Error'}:\x1b[0m ${item.Name} ${item.Status === 'Online' ? 'loaded' : 'failed to load'}`);
  } console.log();

}
module.exports = { loadEvents };