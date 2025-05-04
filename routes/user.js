const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");
const passport = require("passport");
const { required } = require("joi");
const { saveRedirectUrl } = require("../middlewares");

// SIGN-UP Routes ...............................................

router.get("/signup", (req, res) => {
  res.render("users/signup");
});

router.post("/signup", async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const user = new User({
      email,
      username,
    });

    let registerdUser = await User.register(user, password);
    // res.send(registerdUser);
    // console.log(registerdUser);

    // login after register ..
    req.login(registerdUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome back to Wanderlust!");
      res.redirect("/listings");
    });

    // res.redirect("/listings");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
});

// LOG-IN Routes ...............................................

// log-in form .......
router.get("/login", (req, res) => {
  res.render("users/login");
});

// LOGIN ............
router.post(
  "/login",

  saveRedirectUrl,
  // we use res.locals because the handle during the authentication process .  the problem occurs because Passport is creating a new session after authentication , hence the passport not creating the new locals just beacuse we use res.loclas
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    // console.log(req.session.redirectUrl);  // you're right! The issue is related to how sessions are being handled during the authentication process. The problem occurs because Passport is creating a new session after authentication, which causes the loss of your redirectUrl.
    // console.log(req.path);
    // console.log(res.locals.listingId);

    if (res.locals.reqMethod === "DELETE") {
      return res.redirect(`/listings/${res.locals.listingId}`);
    }
      
    const redirectUrl = res.locals.redirectUrl || "/listings";

    // delete req.session.redirectUrl;
    res.redirect(redirectUrl);
  }
);

// Log-Out Route ...............................................

router.get("/logout", (req, res, next) => {
  req.flash("success", "LogOut successful!"); // Correct key
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/listings");
  });
});

module.exports = router;
