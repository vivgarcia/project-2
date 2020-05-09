// var authController = require("../controllers/authcontrollers");
// var db = require("../models");

module.exports = function(app) {
  app.get("/signup", function(req, res) {
    res.render("signup");
  });
  app.get("/signin", function(req, res) {
    res.render("signin");
  });
  app.post('/signup', passport.authenticate('local-signup', {
      successRedirect: '/dashboard',
      failureRedirect: '/signup'
    });
  )};
