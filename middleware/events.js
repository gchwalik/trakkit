//all the middleware goes here
var Event = require("../models/event");

var middlewareObj = {};

middlewareObj.checkEventOwnership = function(req, res, next) {
  //is user logged in at all
  if(req.isAuthenticated()) {
    Event.findById(req.params.id, function(err, foundEvent) {
      if(err) {
        req.flash("error", "Something went wrong");
        res.redirect("back");
      }
      else if(foundEvent === null) {
        req.flash("error", "That event does not exist");
        res.redirect("back");
      }
      else {
        console.log("found event");
        
        //does user own the event
        //foundEvent.owner.id is a js/mongoose object
        //req.user._id is a String
        //can't compate these with ===, and instead use equals()
        if(foundEvent.owner.id.equals(req.user._id)) {
          next();
        }
        else {
          req.flash("error", "You don't have permission to do that");
          //otherwise, redirect
          res.redirect("back");      
        }
      }
    });
  }
  else {
    req.flash("error", "You need to be logged in to do that");
    //take user back to the previous page they were on
    res.redirect("back");
  }
};


module.exports = middlewareObj;


//could also do the following to define the middleware
// module.exports = {
//   ... all functions here	
// }