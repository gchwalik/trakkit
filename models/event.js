var mongoose = require("mongoose");

var eventSchema = new mongoose.Schema({
  name: String,
  description: String,
  color: String,
  owner: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  }
});

module.exports = mongoose.model("Event", eventSchema);