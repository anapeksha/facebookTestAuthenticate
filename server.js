var express = require("express");
var passport = require("passport");
var Strategy = require("passport-facebook").Strategy;

passport.use(
  new Strategy(
    {
      clientID: "433501244067369",
      clientSecret: "fbecf4b9db2c25f07d7a92fb09bc9b06",
      callbackURL: "http://localhost:3000/login/facebook/return"
    },
    function(accessToken, refreshToken, profile, cb) {
      returncb(null, profile);
    }
  )
);

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

var app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(require("morgan")("combined"));
app.use(require("cookie-parser"));
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(
  require("express-session")({
    secret: "node app",
    resave: true,
    saveUninitialized: true
  })
);

//@route    -   GET  /
//@desc     -   a route to the home page
//@access   -   PUBLIC
app.get("/", (req, res) => {
  res.render("home.ejs", {
    user: req.user
  });
});

//@route    -   GET  /login
//@desc     -   a route to the login page
//@access   -   PUBLIC
app.get("/login", (req, res) => {
  res.render("login");
});

//@route    -   GET  /login/facebook
//@desc     -   a route to the facebook auth page
//@access   -   PUBLIC
app.get("/login/facebook", passport.authenticate("facebook"));

//@route    -   GET  /login/facebook/callback
//@desc     -   a route to the facebook auth page
//@access   -   PUBLIC
app.get(
  "/login/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function(req, res) {
    res.redirect("/");
  }
);

//@route    -   GET  /profile
//@desc     -   a route to the profile of user page
//@access   -   PRIVATE
app.get(
  "/profile",
  require("connect-ensure-login").ensureLoggedIn(),
  (req, res) => {
    res.render("profile", {
      user: req.user
    });
  }
);

app.listen("3000", () => {
  console.log("App running at http://localhost:3000");
});
