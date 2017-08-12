var express = require("express");
var router = express.Router();
var passport = require("passport");

var User = require("../models/user");

var middleware = require("../middleware/auth");

// Auth Routes
// show sign up form
router.get("/register", function(req, res) {
  res.render("register");
});

//handling user sign up
router.post("/register", function(req, res) {
	//User.register creates a new User object with just the username populated
	//We don't want to pass the password in directly, because we don't want to store it in plaintext
	//Somehow .register() takes in the password as a second argument, hashes it, and adds it 
	//to the new User object, and then passes is back in the callback function arg "user"
	User.register(new User({username: req.body.username, email: req.body.email}), req.body.password, function(err, user) {
		if(err) {
			console.log(err);
			return res.render('register');
		}
		//this next bit happens once the user has been created and there is no error
		//passport.authenticate() actually logs the user in, takes care of everything in 
		// the session, stores the correct information, runs the serializeUser method, 
		// and specifically uses the "local" strategy as specified below
		//Could optionally use "twitter" or "facebook", or any other strategy
		passport.authenticate("local")(req, res, function() {
			res.redirect("/events");
		});
	});
});

// LOGIN ROUTES
// render login form
router.get("/login", function(req, res) {
	res.render("login");
});

//login logic
//middleware - some code that runs before our final route callback
//when our app gets a post request to "/login", it'll run the 
//passport.authenticate("local", ...) immediately
//we can have multiple middleware stacked up
//the idea is that they sit between the beginning of the route, and the
//handler of the route (callback function), that sits at the end
router.post("/login", passport.authenticate("local", {
	successRedirect: "/events",
	failureRedirect: "/login"
}), function(req, res) {
	
});


router.get("/logout", function(req, res) {
	//we get this from passport
	//when we call this, we're not actually changing any data in the database, etc
	//whats actually happening - passport is destroying all the user data in this session
	//no longer saving this from session to session
	req.logout();
	res.redirect("/");
});


router.get("/user", middleware.isLoggedIn, function(req, res) {
  res.render("user");	
});

module.exports = router;