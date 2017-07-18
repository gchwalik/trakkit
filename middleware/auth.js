//our own middleware!

var middlewareObj = {};

//next is the next thing that needs to be called
//passes control to the next handler
middlewareObj.isLoggedIn = function(req, res, next) {
	//req.isAuthenticated() is also something we get from passport
  if(req.isAuthenticated()) {
  	return next();
  }
  res.redirect("/login");
}

module.exports = middlewareObj;