const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");
const passport = require("passport");

// SIGN-UP Routes ...............................................

router.get("/signup", (req, res) => {
  res.render("users/signup");
});

router.post("/signup", async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const user = new User({
      email,
      username,
    });

    let registerdUser = await User.register(user, password);
    // res.send(registerdUser);
    // console.log(registerdUser);
    res.redirect("/listings");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
    
  }
});

// LOG-IN Routes ...............................................

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    res.redirect("/listings");
  }
);

module.exports = router;
