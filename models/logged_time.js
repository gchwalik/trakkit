var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var loggedTimeSchema = new Schema({
  start: Date,
  end: Date,
  total_time: Number,
  //storing the username directly in the comment, so we save lookup time 
  //when displaying comment list; only possible with nosql
  owner: {
    id: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  forEvent : {
    id: {type: Schema.Types.ObjectId, ref: "Event"}
  }
});

module.exports = mongoose.model("LoggedTime", loggedTimeSchema);