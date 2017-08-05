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


loggedTimeSchema.methods.displayHourAndMinute = function(timeA, timeB) {
  var formatted_timeA = moment(timeA),
      formatted_timeB = moment(timeB);
      
  formatted_timeA = formatted_timeA.format("h:mmA");
  formatted_timeB = formatted_timeB.format("h:mmA");
  
  return formatted_timeA + " - " + formatted_timeB;
}


loggedTimeSchema.methods.displayHourDuration = function(timeA, timeB) {
  var formatted_timeA = moment(timeA),
      formatted_timeB = moment(timeB);

  return formatted_timeB.diff(formatted_timeA, "hours");
}

loggedTimeSchema.methods.displayMinuteDuration = function(timeA, timeB) {
  var formatted_timeA = moment(timeA),
      formatted_timeB = moment(timeB);

  return (formatted_timeB.diff(formatted_timeA, "minutes") % 60);
}


loggedTimeSchema.methods.formatTimeForForm = function(time_to_format) {
  var formatted_time = moment(time_to_format);
  return formatted_time.format("YYYY-MM-DDTHH:mm");
}

module.exports = mongoose.model("LoggedTime", loggedTimeSchema);