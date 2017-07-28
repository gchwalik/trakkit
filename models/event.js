var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var eventSchema = new Schema({
  name: String,
  description: String,
  color: String,
  logged_times: [
      {type: Schema.Types.ObjectId, ref: 'LoggedTime'}
    ],
  owner: {
    id: {
      type: Schema.Types.ObjectId, ref: "User"
    },
    username: String
  }
});

module.exports = mongoose.model("Event", eventSchema);