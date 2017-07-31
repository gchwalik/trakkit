//all the middleware goes here
var LoggedTime = require("../models/logged_time");

var middlewareObj = {};

middlewareObj.checkLoggedTimeOwnership = function(req, res, next) {
  //is user logged in at all
  if(req.isAuthenticated()) {
    LoggedTime.findById(req.params.time_id, function(err, foundLoggedTime) {
      if(err) {
        console.log(err);
        res.redirect("back");
      }
      else {
        //does user own the event
        //foundEvent.owner.id is a js/mongoose object
        //req.user._id is a String
        //can't compate these with ===, and instead use equals()
        if(foundLoggedTime.owner.id.equals(req.user._id)) {
          next();
        }
        else {
          console.log("You don't have permission to do that");
          //otherwise, redirect
          res.redirect("back");      
        }
      }
    });
  }
  else {
    console.log("You need to be logged in to do that");
    //take user back to the previous page they were on
    res.redirect("back");
  }
};


middlewareObj.sortDates = function(logged_timeA, logged_timeB) {
    if( 
        //the two dates are equal
        (
            (logged_timeA.startYear === logged_timeB.startYear) && 
            (logged_timeA.startMonth === logged_timeB.startMonth) &&
            (logged_timeA.startDate === logged_timeB.startDate) &&
            (logged_timeA.startHour === logged_timeB.startHour) &&
            (logged_timeA.startMinute === logged_timeB.startMinute) &&
            (logged_timeA.endYear === logged_timeB.endYear) &&
            (logged_timeA.endMonth === logged_timeB.endMonth) &&
            (logged_timeA.endDate === logged_timeB.endDate) &&
            (logged_timeA.endHour === logged_timeB.endHour) &&
            (logged_timeA.endMinute === logged_timeB.endMinute)
        )
    )
        { return 0; }
    
    else if(   
        //timeA comes first
        (
            //timeA start year comes first
            (logged_timeA.startYear < logged_timeB.startYear) || 
            //years match, but timeA start month comes first
            ((logged_timeA.startYear === logged_timeB.startYear) && 
                (logged_timeA.startMonth < logged_timeB.startMonth)) ||
            //start years and months match, but timeA start date comes first
            ((logged_timeA.startYear === logged_timeB.startYear) && 
                (logged_timeA.startMonth === logged_timeB.startMonth) &&
                (logged_timeA.startDate < logged_timeB.startDate)) ||
            //start years/months/dates match, but timeA start hour comes first
            ((logged_timeA.startYear === logged_timeB.startYear) && 
                (logged_timeA.startMonth === logged_timeB.startMonth) &&
                (logged_timeA.startDate === logged_timeB.startDate) &&
                (logged_timeA.startHour < logged_timeB.startHour)) ||
            //start years/months/dates/hours match, but timeA start minute comes first
            ((logged_timeA.startYear === logged_timeB.startYear) && 
                (logged_timeA.startMonth === logged_timeB.startMonth) &&
                (logged_timeA.startDate === logged_timeB.startDate) &&
                (logged_timeA.startHour === logged_timeB.startHour) &&
                (logged_timeA.startMinute < logged_timeB.startMinute)) ||
            //start years/months/dates/hours/minutes match,
            //but timeA end year comes first
            ((logged_timeA.startYear === logged_timeB.startYear) && 
                (logged_timeA.startMonth === logged_timeB.startMonth) &&
                (logged_timeA.startDate === logged_timeB.startDate) &&
                (logged_timeA.startHour === logged_timeB.startHour) &&
                (logged_timeA.startMinute === logged_timeB.startMinute) &&
                (logged_timeA.endYear < logged_timeB.endYear)) ||
            //start years/months/dates/hours/minutes and end years match,
            //but timeA end month comes first
            ((logged_timeA.startYear === logged_timeB.startYear) && 
                (logged_timeA.startMonth === logged_timeB.startMonth) &&
                (logged_timeA.startDate === logged_timeB.startDate) &&
                (logged_timeA.startHour === logged_timeB.startHour) &&
                (logged_timeA.startMinute === logged_timeB.startMinute) &&
                (logged_timeA.endYear === logged_timeB.endYear) &&
                (logged_timeA.endMonth < logged_timeB.endMonth)) ||
            //start years/months/dates/hours/minutes and end years/months match,
            //but timeA end date comes first
            ((logged_timeA.startYear === logged_timeB.startYear) && 
                (logged_timeA.startMonth === logged_timeB.startMonth) &&
                (logged_timeA.startDate === logged_timeB.startDate) &&
                (logged_timeA.startHour === logged_timeB.startHour) &&
                (logged_timeA.startMinute === logged_timeB.startMinute) &&
                (logged_timeA.endYear === logged_timeB.endYear) &&
                (logged_timeA.endMonth === logged_timeB.endMonth) &&
                (logged_timeA.endDate < logged_timeB.endDate)) ||
            //start years/months/dates/hours/minutes and end years/months/dates match,
            //but timeA end hour comes first
            ((logged_timeA.startYear === logged_timeB.startYear) && 
                (logged_timeA.startMonth === logged_timeB.startMonth) &&
                (logged_timeA.startDate === logged_timeB.startDate) &&
                (logged_timeA.startHour === logged_timeB.startHour) &&
                (logged_timeA.startMinute === logged_timeB.startMinute) &&
                (logged_timeA.endYear === logged_timeB.endYear) &&
                (logged_timeA.endMonth === logged_timeB.endMonth) &&
                (logged_timeA.endDate === logged_timeB.endDate) &&
                (logged_timeA.endHour < logged_timeB.endHour)) ||
            //start years/months/dates/hours/minutes and end years/months/dates match,
            //but timeA end hour comes first
           ((logged_timeA.startYear === logged_timeB.startYear) && 
                (logged_timeA.startMonth === logged_timeB.startMonth) &&
                (logged_timeA.startDate === logged_timeB.startDate) &&
                (logged_timeA.startHour === logged_timeB.startHour) &&
                (logged_timeA.startMinute === logged_timeB.startMinute) &&
                (logged_timeA.endYear === logged_timeB.endYear) &&
                (logged_timeA.endMonth === logged_timeB.endMonth) &&
                (logged_timeA.endDate === logged_timeB.endDate) &&
                (logged_timeA.endHour === logged_timeB.endHour) &&
                (logged_timeA.endMinute < logged_timeB.endMinute)) 
        )
    ) { return -1; }
    
    else { return 1; }

};

module.exports = middlewareObj;


//could also do the following to define the middleware
// module.exports = {
//   ... all functions here	
// }