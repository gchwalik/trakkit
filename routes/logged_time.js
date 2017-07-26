var express = require("express");
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


//EDIT - form to edit already logged time

//UPDATE - persist logged time updates

//DESTROY - delete the logged time instance


module.exports = router;