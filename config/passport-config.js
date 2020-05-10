var LocalStrategy = require("passport-local").Strategy;
var bcrypt = require("bcrypt");

function initialize(passport, Users) {
  var authenticateUser = async function (email, password, done) {
    var user = await Users.findOne({where: { email: email }});
    if (user == null) {
      return done(null, false, { message: "No user with that email" });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password is incorrect" });
      }
    } catch (e) {
      return done(e);
    }
  }

  passport.use(new LocalStrategy({ usernameField: "email"},
  authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    Users.findByPk(id, function(err, user) {
      console.log("Made it here");
      console.log(err);
      done(err, user);
    });
  });
}

module.exports = initialize;