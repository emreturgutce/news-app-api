const passport = require("passport"),
  localStrategy = require("passport-local").Strategy,
  JWTStrategy = require("passport-jwt").Strategy,
  ExtractJWT = require("passport-jwt").ExtractJwt,
  User = require("../models/User"),
  Favorites = require("../models/Favorites");

const deletePasswordFromUser = (user) => {
  const userObject = Object.assign({}, user);
  delete userObject.password;
  return userObject;
};

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const { username } = req.body;
      try {
        const favorites = new Favorites({});
        await favorites.save();
        const user = new User({
          username,
          email,
          password,
          favoritesId: favorites._id,
        });
        await user.save;
        await user.generateAuthToken();
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const user = await User.findByCredentials(email, password);
        const userObject = deletePasswordFromUser(user);
        return done(null, userObject);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  "jwt",
  new JWTStrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        const user = await User.findOne({ id: token.sub });
        const userObject = deletePasswordFromUser(user);
        done(null, userObject);
      } catch (err) {
        done(err);
      }
    }
  )
);

module.exports = passport;
