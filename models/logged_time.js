var mongoose = require("mongoose");

var loggedTimeSchema = new mongoose.Schema({
  text: String,
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

module.exports = mongoose.model("Comment", loggedTimeSchema);