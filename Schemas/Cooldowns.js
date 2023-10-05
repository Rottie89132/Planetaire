const { model, Schema } = require("mongoose");

module.exports = model("cooldowns", new Schema({
        GuildID: { type: String },
        Type: { type: String },
        TimeOut: { type: Date, expires: 900 },
        UserID: { type: String },
        MessageID: { type: String },
}));
