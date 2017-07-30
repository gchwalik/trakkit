var mongoose = require("mongoose"),
    moment = require("moment");
var Schema = mongoose.Schema;

var loggedTimeSchema = new Schema({
  start: Date,
  end: Date,
  hours: Number,
  minutes: Number,
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


loggedTimeSchema.methods.displayTime = function(time_to_format) {
  var formatted_time = moment(time_to_format);
  return formatted_time.format("MMM D, YYYY");
};

loggedTimeSchema.methods.formTime = function(time_to_format) {
  var formatted_time = moment(time_to_format);
  return formatted_time.format("YYYY-MM-DDTHH:mm");
}

module.exports = mongoose.model("LoggedTime", loggedTimeSchema);