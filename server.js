require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
var bcrypt = require("bcrypt");
var passport = require("passport");
var flash = require("express-flash");
var session = require("express-session");
var db = require("./models");
var methodOverride = require('method-override');

var Users = db.User;

var initializePassport = require("./config/passport-config");
initializePassport(passport, Users);

var Users = db.User;

var initializePassport = require("./config/passport-config");
initializePassport(passport, Users);

var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"))

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
// Will load dashboard after user signs in
app.get("/", checkSignedIn, function(req, res) {
  //console.log("Made it to dash");
  //console.log(req.user);
  res.render("dashboard", { username: req.user.username });
});

// Renders sign in page
app.get("/signin", checkNotSignedIn, function(req, res) {
  res.render("signin");
});

// Will attempt to authenticate user provided account info with passport-config.js
app.post(
  "/signin",
  checkNotSignedIn,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/signin",
    failureFlash: true 
  })
);

// Renders register page
app.get("/signup", checkNotSignedIn, function(req, res) {
  res.render("signup");
});

// Route for registering user
app.post("/signup", checkNotSignedIn, function(req, res) {
  console.log("Sign up called");
  try {
    var hashedPassword;
    // Takes user input password and encrypts it for storage
    bcrypt.hash(req.body.password, 10).then(function(hash) {
      // Store hash in your password DB.
      hashedPassword = hash;
      // Adds user to database
      Users.create({
        username: req.body.username,
        password: hashedPassword,
        name: req.body.name,
        email: req.body.email,
        platform: req.body.platform
      });
      // Up completion go to sign in
      res.redirect("/signin");
    });
  } catch (error) {
    // If error return to signup page
    res.redirect("/signup");
  }
});

//logs the user out and redirects to signin page 
app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/signin')
})

//redirects user if they are not logged in
function checkSignedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/signin");
}

function checkNotSignedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function () {
  app.listen(PORT, function () {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;