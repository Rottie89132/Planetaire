const { model, Schema } = require("mongoose");

module.exports = model("Guild", new Schema({
    GuildId: String,
    GuildName: String,
    ReviewChannel: String,
    LogChannel: String
}))