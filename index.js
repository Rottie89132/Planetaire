const { Client, Collection } = require('discord.js')
const client = new Client({intents: [32767, 130685] })
const { loadEvents } = require("./handlers/eventHandler");
require("./handlers/AntiCrash.js")(client);

client.events = new Collection()
client.commands = new Collection()
client.contexts = new Collection()
client.buttons = new Collection()
client.selects = new Collection()
client.modals = new Collection()

const mongoose = require("mongoose");
mongoose.set('strictQuery', false)
mongoose.connect(process.env.DataBaseUrl, {}).then(() => console.log(`\x1b[32m√\x1b[0m Database successfully connected!`))

loadEvents(client);

client.login(process.env.token)

