//all the middleware goes here
var Event = require("../models/event");

var middlewareObj = {};

middlewareObj.checkEventOwnership = function(req, res, next) {
  //is user logged in at all
  if(req.isAuthenticated()) {
    Event.findById(req.params.id, function(err, foundEvent) {
      if(err) {
        console.log(err);
        res.redirect("back");
      }
      else {
        //does user own the campground
        //foundCampground.author.id is a js/mongoose object
        //req.user._id is a String
        //can't compate these with ===, and instead use equals()
        if(foundEvent.author.id.equals(req.user._id)) {
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


module.exports = middlewareObj;


//could also do the following to define the middleware
// module.exports = {
//   ... all functions here	
// }