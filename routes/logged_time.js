var express = require("express"),
    moment = require("moment");

var ObjectId = require('mongoose').Schema.ObjectId;

var router = express.Router({mergeParams: true});


var Event = require("../models/event"),
    LoggedTime = require("../models/logged_time");
    
//if we just require a directory, the framework automatically imports
//the contents of the index.js file
var authMiddleware = require("../middleware/auth.js"),
    eventsMiddleware = require("../middleware/events.js"),
    timeMiddleware = require("../middleware/logged_time.js");
    
//NEW - form to create new logged time
router.get("/new", authMiddleware.isLoggedIn, eventsMiddleware.checkEventOwnership, function(req, res) {
  //find event by id
  Event.findById(req.params.id, function(err, foundEvent) {
    if(err) {
      console.log(err);
    }
    else {
      var date = moment(new Date());
      date = date.subtract(7, 'hours')
      date = date.format("YYYY-MM-DDTHH:mm");

      res.render("logged_time/new", {event: foundEvent, date: date});
    }
  });
});

//CREATE - persist the logged time
//CREATE loggedTime
router.post("/", authMiddleware.isLoggedIn, eventsMiddleware.checkEventOwnership, function(req, res) {
  //lookup campground using id
  Event.findById(req.params.id, function(err, foundEvent) {
    if(err) {
      req.flash("error", "Something went wrong.");
      res.redirect("/events");
    }
    else {
      //create new comment
      LoggedTime.create(req.body.time, function(err, time) {
        if(err) {
          req.flash("error", "Something went wrong.");
          res.redirect("/events/" + foundEvent._id);
        }
        else {
          //add Event to logged_time
          time.forEvent.id = foundEvent._id;

          //persist pieces of time
          time.startYear = time.start.getYear() + 1900; //else 0 = 1900, and 100 = 2000
          time.startMonth = time.start.getMonth()+1; //cause indexes month from 0
          time.startDate = time.start.getDate();
          time.startHour = time.start.getHours();
          time.startMinute = time.start.getMinutes();
          
          time.endYear = time.end.getYear() + 1900;
          time.endMonth = time.end.getMonth()+1;
          time.endDate = time.end.getDate();
          time.endHour = time.end.getHours();
          time.endMinute = time.end.getMinutes();

          //persist total time logged          
          var start = moment(time.start);
          var end = moment(time.end);
          
          time.hours = end.diff(start, "hours");
          time.minutes = end.diff(start, "minutes")%60;

          //add username and id to comment
          time.owner.id = req.user._id;
          time.owner.username = req.user.username;
          time.save();
          
          //connect new logged_time to event
          foundEvent.logged_times.push(time);
          foundEvent.save();

          req.flash("success", "Successfully logged time.");
          //redirect to campground show page
          res.redirect('/events/' + foundEvent._id);
        } //else
      }); //LoggedTime.create()
    } //else
  }); //Event.findById()
});

//EDIT - form to edit already logged time
router.get("/:time_id/edit", 
  authMiddleware.isLoggedIn, 
  eventsMiddleware.checkEventOwnership, 
  timeMiddleware.checkLoggedTimeOwnership, 
  function(req, res) {
    Event.findById(req.params.id, function(err, foundEvent) {
      if(err) {
        res.redirect("back");
      }
      else {
        LoggedTime.findById(req.params.time_id, function(err, foundTime) {
          if(err) {
            req.flash("error", "Something went wrong.");
            res.redirect("back");
          }
          else {
            res.render("logged_time/edit", {event: foundEvent, time: foundTime});
          }
        }); //LoggedTime.findById()              
      } //else
    }); //Event.findById()
  }
);

//UPDATE - persist logged time updates
router.put("/:time_id", 
  authMiddleware.isLoggedIn, 
  eventsMiddleware.checkEventOwnership, 
  timeMiddleware.checkLoggedTimeOwnership,
  function(req, res) {
    //lookup event using id
    Event.findById(req.params.id, function(err, foundEvent) {
      if(err) {
        req.flash("error", "Something went wrong.");
        res.redirect("/events/:id");
      }
      else {
        //create new logged_time
        LoggedTime.findById(req.params.time_id, function(err, foundTime) {
          if(err) {
            req.flash("error", "Something went wrong.");
            res.redirect("/events/:id");
          }
          else {
            var time = req.body.time;
            time.start = new Date(time.start);
            time.end = new Date(time.end);
            
            //persist start and end values passed in
            foundTime.start = time.start;
            foundTime.end = time.end;
            
            //persist pieces of time
            foundTime.startYear = time.start.getYear() + 1900; //else 0 = 1900, and 100 = 2000
            foundTime.startMonth = time.start.getMonth()+1; //cause indexes month from 0
            foundTime.startDate = time.start.getDate();
            foundTime.startHour = time.start.getHours();
            foundTime.startMinute = time.start.getMinutes();
            
            foundTime.endYear = time.end.getYear() + 1900;
            foundTime.endMonth = time.end.getMonth()+1;
            foundTime.endDate = time.end.getDate();
            foundTime.endHour = time.end.getHours();
            foundTime.endMinute = time.end.getMinutes();
            
            //persist total time logged          
            var start = moment(foundTime.start);
            var end = moment(foundTime.end);
            
            foundTime.hours = end.diff(start, "hours");
            foundTime.minutes = end.diff(start, "minutes")%60;
  
            foundTime.save();
  
            // foundTime.update({start: foundTime.start, end: foundTime.end, hours: hours, minutes: minutes, 
            //   startYear: startYear, startMonth: startMonth, startDate: startDate, startHour: startHour, startMinute: startMinute,
            //   endYear: endYear, endMonth: endMonth, endDate: endDate, endHour: endHour, endMinute: endMinute
            // });
  
            req.flash("success", "Successfully updated logged time.");
            //redirect to campground show page
            res.redirect('/events/' + foundEvent._id);
          } //else
        }); //Comment.create()
      } //else
    }); //Campground.findById()
  }
);

//DESTROY - delete the logged time instance
router.delete("/:time_id", 
  authMiddleware.isLoggedIn, 
  eventsMiddleware.checkEventOwnership, 
  timeMiddleware.checkLoggedTimeOwnership,
  function(req, res) {
    LoggedTime.findByIdAndRemove(req.params.time_id, function(err) {
      if(err) {
        req.flash("error", "Something went wrong");
        res.redirect("back");
      }
      else {
        req.flash("success", "Successfully deleted logged time.");
        res.redirect("/events/" + req.params.id);
      }
    });
  }
);

module.exports = router;