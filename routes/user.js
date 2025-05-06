const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");
const passport = require("passport");
// const { required } = require("joi");
const { saveRedirectUrl } = require("../middlewares");

// usersController ...............
const usersController = require("../controllers/usersController");

// SIGN-UP Routes ...............................................
// signup form
router.get("/signup", usersController.getSignUpForm);

// signup
router.post("/signup", usersController.signup);

// LOG-IN Routes ...............................................
// log-in form .......
router.get("/login", usersController.getLogInForm);

// LOGIN ............
router.post(
  "/login",

  saveRedirectUrl,
  // we use res.locals because the handle during the authentication process .  the problem occurs because Passport is creating a new session after authentication , hence the passport not creating the new locals just beacuse we use res.loclas
  passport.authenticate("local", {
    // login done by passport.authenticate
    failureRedirect: "/login",
    failureFlash: true,
  }),
  usersController.login
);

// Log-Out Route ...............................................

router.get("/logout", usersController.logout);

module.exports = router;