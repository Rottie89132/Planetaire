const { Client, Collection } = require('discord.js')
const client = new Client({intents: 130685})
const Config = require("./items/config.json");

const { loadEvents } = require("./handlers/eventHandler");
require("./handlers/AntiCrash.js")(client);

client.events = new Collection()
client.commands = new Collection()
client.contexts = new Collection()
client.buttons = new Collection()
client.selects = new Collection()
client.modals = new Collection()

const { connect } = require("mongoose");
connect(Config.DataBaseUrl, {}).then(() => console.log(`Planetaire#9265 is connected to the database`))

loadEvents(client);

client.login(Config.token)
