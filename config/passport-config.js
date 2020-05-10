var LocalStrategy = require("passport-local").Strategy;
var bcrypt = require("bcrypt");

function initialize(passport, Users) {
  // This function searches database for user sign in info
  var authenticateUser = async function (email, password, done) {
    // Searches database for provided email
    var user = await Users.findOne({where: { email: email }});
    // If no user is found then email must not be registered
    if (user == null) {
      return done(null, false, { message: "No user with that email" });
    }

    try {
      // Compares db password and user password
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password is incorrect" });
      }
    } catch (e) {
      return done(e);
    }
  }

  /* This strategy will take in the email and password from the sign in page and will
  pass it into the authenticateUser function*/
  passport.use(new LocalStrategy({ usernameField: "email"},
  authenticateUser));
  // Takes in the user information found in previous function and saves it in session
  passport.serializeUser((user, done) => done(null, user.id));
  // Allows handlebars to access the user saved in session
  passport.deserializeUser((id, done) => {
    Users.findByPk(id, function(err, user) {
      //console.log("Made it here");
      //console.log(err);
      done(err, user);
    });
  });
}

module.exports = initialize;