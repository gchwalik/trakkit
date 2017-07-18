var express = require("express");
var router = express.Router()

//if we just require a directory, the framework automatically imports
//the contents of the index.js file
var middleware = require("../middleware/auth.js");

//when a get request comes in for "/secret", it first runs isLoggedIn
//before it does anything else
//if isLoggedIn shows the user is currently authenticated, it calls next()
//which refers to our lambda function here rendering the secret page
router.get("/", middleware.isLoggedIn, function(req, res) {
	res.render("./events/index.ejs");
});

module.exports = router;