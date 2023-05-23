const { model, Schema } = require("mongoose");

module.exports = model("Cooldowns", new Schema({
    GuildId: String,
    MessageID: String,
    Cooldown: String,
}))