var express = require("express"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    passportLocalMongoose = require("passport-local-mongoose"),
    LocalStrategy = require("passport-local");


//requiring models/schemas
var User = require("./models/user"),
    Event = require("./models/event");

//requiring routes
var authRoutes = require("./routes/auth.js"),
    eventRoutes = require("./routes/events.js"),
    timeRoutes = require("./routes/logged_time.js");
//if we just require a directory, the framework automatically imports
//the contents of the index.js file
var middleware = require("./middleware/auth.js");

mongoose.connect("mongodb://localhost/trakkit");

var app = express();
app.set('view engine', 'ejs');
//need this line anytime we're using a form and posting data to a request
app.use(bodyParser.urlencoded({extended: true}));
//__dirname refers to the dir this script is run from
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));


//inline declaration of a require()
//running it as a function and passing in some arguments
app.use(require("express-session") ({
	secret: "secret cypher",
	resave: false,
	saveUninitialized: false
}));

//setting passport up so it will work in the app
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
//responsible for reading the session, taking encoded data from the session
//and decoding it (deserialize), and then encoding it (serialize) and 
//putting it back in the session

//rather than needing to write our own serialize and deserialize methods
//in user.js, by adding in passpost-local-mongoose, we've added those methods
//in automatically
//we're using the ones that come with passport-local-mongoose and just 
//telling passport to use what's already defined on the user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//this is a middleware where whatever we provide to it will be called on every route
//whatever we put inside "res.locals" is available inside our template 
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  //res.locals.error = req.flash("error");
  //res.locals.success = req.flash("success");
  next();
});


//===========
// ROUTES
//===========



app.get("/", function(req, res) {
	res.render("home");
});


app.use("/", authRoutes);
app.use("/events", eventRoutes);
app.use("/events/:id/time", timeRoutes);





	

app.listen(process.env.PORT, process.env.IP, function() {
	console.log("server is listening");
});