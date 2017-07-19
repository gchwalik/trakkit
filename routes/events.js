var express = require("express");
var router = express.Router()

var Event = require("../models/event");

//if we just require a directory, the framework automatically imports
//the contents of the index.js file
var middleware = require("../middleware/auth.js");

//when a get request comes in for "/secret", it first runs isLoggedIn
//before it does anything else
//if isLoggedIn shows the user is currently authenticated, it calls next()
//which refers to our lambda function here rendering the secret page
router.get("/", middleware.isLoggedIn, function(req, res) {
	Event.find({}, function(err, allEvents) {
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

router.post("/", middleware.isLoggedIn, function(req, res) {
   var name = req.body.name;
   var desc = req.body.description;
   var color = req.body.color; 
   
   var author = {
     id: req.user._id,
     username: req.user.username
   };

  var newEvent = {name: name, description:desc, color: color, author: author};
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

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("events/new");	
});

module.exports = router;