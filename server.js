require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
var bcrypt = require("bcrypt");
var passport = require("passport");
var flash = require("express-flash");
var session = require("express-session");

var Users = db.User;

var initializePassport = require("./config/passport-config");
initializePassport(passport,
  function (email) {
    Users.findOne({ email: email });
  }
)


var db = require("./models");

var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
app.get("/", function (req, res) {
  res.render("dashboard");
});

app.get("/signin", function (req, res) {
  res.render("signin");
});

app.post("/signin", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/signup",
  failureFlash: true
}));

app.get("/signup", function (req, res) {
  res.render("signin");
});

// Route for registering user
app.post("/signup", function (req, res) {
  try {
    // Takes user input password and encrypts it for storage
    var hashedPassword = await bcrypt.hash(req.body.password, 10);
    // Adds user to database
    User.create({
      username: req.body.username,
      password: hashedPassword,
      name: req.body.name,
      email: req.body.email,
      platform: req.body.platform
    });
    // Up completion go to sign in
    res.redirect("/signin");
  } catch (error) {
    // If error return to signup page
    res.redirect("/signup");
  }
});

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
