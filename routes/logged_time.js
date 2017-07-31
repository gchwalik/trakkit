var express = require("express"),
    moment = require("moment");

var ObjectId = require('mongoose').Schema.ObjectId;

var router = express.Router({mergeParams: true});


var Event = require("../models/event"),
    LoggedTime = require("../models/logged_time");
    
//if we just require a directory, the framework automatically imports
//the contents of the index.js file
var authMiddleware = require("../middleware/auth.js"),
    eventsMiddleware = require("../middleware/events.js");
    
//NEW - form to create new logged time
router.get("/new", authMiddleware.isLoggedIn, eventsMiddleware.checkEventOwnership, function(req, res) {
  //find event by id
  Event.findById(req.params.id, function(err, foundEvent) {
    if(err) {
      console.log(err);
    }
    else {
      res.render("logged_time/new", {event: foundEvent});
    }
  });
});

//CREATE - persist the logged time
//CREATE loggedTime
router.post("/", authMiddleware.isLoggedIn, eventsMiddleware.checkEventOwnership, function(req, res) {
  //lookup campground using id
  Event.findById(req.params.id, function(err, foundEvent) {
    if(err) {
      console.log(err);
      res.redirect("/events");
    }
    else {
      //create new comment
      LoggedTime.create(req.body.time, function(err, time) {
        if(err) {
          console.log("Something went wrong");
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
          
          //connect new comment to campground
          foundEvent.logged_times.push(time);
          foundEvent.save();

          console.log("Successfully added comment");
          //redirect to campground show page
          res.redirect('/events/' + foundEvent._id);
        } //else
      }); //Comment.create()
    } //else
  }); //Campground.findById()
});

//EDIT - form to edit already logged time
router.get("/:time_id/edit", authMiddleware.isLoggedIn, eventsMiddleware.checkEventOwnership, function(req, res) {
    Event.findById(req.params.id, function(err, foundEvent) {
      if(err) {
        res.redirect("back");
      }
      else {
        LoggedTime.findById(req.params.time_id, function(err, foundTime) {
          if(err) {
            res.redirect("back");
          }
          else {
            res.render("logged_time/edit", {event: foundEvent, time: foundTime});
          }
        }); //LoggedTime.findById()              
      } //else
    }); //Event.findById()
});

//UPDATE - persist logged time updates
router.put("/:time_id", authMiddleware.isLoggedIn, eventsMiddleware.checkEventOwnership, function(req, res) {
  //lookup campground using id
  Event.findById(req.params.id, function(err, foundEvent) {
    if(err) {
      console.log(err);
      res.redirect("/events/:id");
    }
    else {
      //create new comment
      LoggedTime.findById(req.params.time_id, function(err, foundTime) {
        if(err) {
          console.log("Something went wrong");
          res.redirect("/events/" + foundEvent._id)
        }
        else {
          //persist pieces of time
          var startYear = foundTime.start.getYear() + 1900; //else 0 = 1900, and 100 = 2000
          var startMonth = foundTime.start.getMonth()+1; //cause indexes month from 0
          var startDate = foundTime.start.getDate();
          var startHour = foundTime.start.getHours();
          var startMinute = foundTime.start.getMinutes();
          
          var endYear = foundTime.end.getYear() + 1900;
          var endMonth = foundTime.end.getMonth()+1;
          var endDate = foundTime.end.getDate();
          var endHour = foundTime.end.getHours();
          var endMinute = foundTime.end.getMinutes();
          
          //persist total time logged          
          var start = moment(foundTime.start);
          var end = moment(foundTime.end);
          
          var hours = end.diff(start, "hours");
          var minutes = end.diff(start, "minutes")%60;

          foundTime.update({start: start, end: end, hours: hours, minutes: minutes});

          console.log("Successfully added comment");
          //redirect to campground show page
          res.redirect('/events/' + foundEvent._id);
        } //else
      }); //Comment.create()
    } //else
  }); //Campground.findById()
});

//DESTROY - delete the logged time instance
router.delete("/:time_id", function(req, res) {
  LoggedTime.findByIdAndRemove(req.params.time_id, function(err) {
    if(err) {
      res.redirect("back");
    }
    else {
      res.redirect("/events/" + req.params.id);
    }
  });
});

module.exports = router;