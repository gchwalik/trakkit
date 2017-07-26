var express = require("express");
var ObjectId = require('mongoose').Schema.ObjectId;

var router = express.Router();


var Event = require("../models/event");

//if we just require a directory, the framework automatically imports
//the contents of the index.js file
var authMiddleware = require("../middleware/auth.js"),
    eventsMiddleware = require("../middleware/events.js");


//when a get request comes in for "/secret", it first runs isLoggedIn
//before it does anything else
//if isLoggedIn shows the user is currently authenticated, it calls next()
//which refers to our lambda function here rendering the secret page

//INDEX
router.get("/", authMiddleware.isLoggedIn, function(req, res) {
	Event.find({"owner.id": req.user._id}, function(err, allEvents) {
	  if(err) {
	    console.log(err);
	    res.redirect("/");
	  }
	  else {
	    //we also get the current logged in user for free from passport with req.user
	    res.render("events/index", {events: allEvents});
	  }
	});
});

//CREATE - persist new event
router.post("/", authMiddleware.isLoggedIn, function(req, res) {
   var name = req.body.name;
   var desc = req.body.description;
   var color = req.body.color; 
   
   var owner = {
     id: req.user._id,
     username: req.user.username
   };

  var newEvent = {name: name, description:desc, color: color, owner: owner};
  //Create new campground and save to DB
  Event.create(newEvent, function(err, newlyCreated) {
    if(err) {
      console.log(err);
      res.redirect("/");
    }
    else {
      //redirect back to campgrounds page
      //default is to redirect with a GET requests
      res.redirect("/events");      
    }
   });

});

//NEW - show form to create new event
router.get("/new", authMiddleware.isLoggedIn, function(req, res) {
  res.render("events/new");	
});


//SHOW - show details of one event
router.get("/:id", authMiddleware.isLoggedIn, eventsMiddleware.checkEventOwnership, function(req, res) {
  //find the campground with provided ID
  Event.findById(req.params.id, function(err, foundEvent) {
    if(err) {
      console.log(err);
      res.redirect("/events");
    }
    else {
      //render show template with campground
      res.render("./events/show", {event: foundEvent});
    }
  });
});


//EDIT EVENT ROUTE - form
router.get("/:id/edit", authMiddleware.isLoggedIn, eventsMiddleware.checkEventOwnership, function(req, res) {
  Event.findById(req.params.id, function(err, foundEvent) {
    if(err) {
      console.log(err);
      res.redirect("/events");
    }
    else {
      res.render("./events/edit", {event: foundEvent});
    }
  });
});

//UPDATE EVENT ROUTE
router.put("/:id", authMiddleware.isLoggedIn, eventsMiddleware.checkEventOwnership, function(req, res) {
  //find and update the correct event
  Event.findByIdAndUpdate(req.params.id, req.body.event, function(err, updatedEvent) {
    if(err) {
      res.redirect("/events");
    }
    else {
      //redirect somewhere (show page)
      res.redirect("/events/" + req.params.id);
    }
  });
});

//DESTROY EVENT ROUTE
router.delete("/:id", authMiddleware.isLoggedIn, eventsMiddleware.checkEventOwnership, function(req, res) {
  Event.findByIdAndRemove(req.params.id, function(err) {
    if(err) {
      res.redirect("/events");
    }
    else {
      res.redirect("/events");
    }
  });
});


module.exports = router;