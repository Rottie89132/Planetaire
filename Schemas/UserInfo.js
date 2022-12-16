const { model, Schema } = require("mongoose");

module.exports = model("DataUser", new Schema({
    Guild: String,
    User: String,
    Cooldown: String
}))