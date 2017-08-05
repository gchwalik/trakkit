var mongoose = require("mongoose"),
    moment = require("moment");
var Schema = mongoose.Schema;

var loggedTimeSchema = new Schema({
  start: Date,
  end: Date,
  
  startYear: Number,
  startMonth: Number,
  startDate: Number,
  startHour: Number,
  startMinute: Number,
  
  endYear: Number,
  endMonth: Number,
  endDate: Number,
  endHour: Number,
  endMinute: Number,
  
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


loggedTimeSchema.methods.displayMonthAndDay = function(time_to_format) {
  var formatted_time = moment(time_to_format);
  return formatted_time.format("MMM D");
};

loggedTimeSchema.methods.timeDisplay = function(timeA, timeB) {
  var formatted_timeA = moment(timeA),
      formatted_timeB = moment(timeB);
      
  formatted_timeA = formatted_timeA.format("hh:mmA");
  formatted_timeB = formatted_timeB.format("hh:mmA");
  
  return formatted_timeA + " - " + formatted_timeB;
}

loggedTimeSchema.methods.formTime = function(time_to_format) {
  var formatted_time = moment(time_to_format);
  return formatted_time.format("YYYY-MM-DDTHH:mm");
}

module.exports = mongoose.model("LoggedTime", loggedTimeSchema);