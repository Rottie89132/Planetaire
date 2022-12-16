const { model, Schema } = require("mongoose");

module.exports = model("Reviews", new Schema({
    User: String,
    Nickname: String,
    Data: Array
}))

