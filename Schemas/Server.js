const { model, Schema } = require("mongoose");

module.exports = model("Servers", new Schema({
    GuildID: String,
    GuildName: String,
    GuildIcon: String,
    Channels: Array
}))