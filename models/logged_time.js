var mongoose = require("mongoose");

var loggedTimeSchema = new mongoose.Schema({
  forEvent: String,
  start: Date,
  end: Date,
  total_time: Number,
  //storing the username directly in the comment, so we save lookup time 
  //when displaying comment list; only possible with nosql
  owner: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  }
});

module.exports = mongoose.model("LoggedTime", loggedTimeSchema);