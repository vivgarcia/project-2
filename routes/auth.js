// var authController = require("../controllers/authcontrollers");
// var db = require("../models");

module.exports = function (app, passport) {
  app.get("/signup", function (req, res) {
    res.render("signup");
  });
  app.get("/signin", function (req, res) {
    res.render("signin");
  });
  //route for posting to signup
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/dashboard',
    failureRedirect: '/signup'
  });
  );
  app.get('/dashboard', function (req, res) {
    res.render('dashboard');
  });
  //logs out user, reroutes to homepage
  app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
      res.redirect('/');
    });
  });
  //reroutes user to signin if they are not logged in
  app.get('/dashboard', function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/signin');
  });
  app.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/dashboard',
    failureRedirect: '/signin'
  }
  ));
};

