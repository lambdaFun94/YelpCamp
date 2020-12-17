const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utilities/wrapAsync");
const users = require("../controllers/users");
const passport = require("passport");

router
  .route("/register")
  .get(users.showRegistrationForm)
  .post(wrapAsync(users.registerNewUser));

router
  .route("/login")
  .get(users.showLoginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

router.get("/logout", users.logout);

module.exports = router;
