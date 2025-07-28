const User = require("../models/userSchema");

module.exports.getSignUpForm = (req, res) => {
  res.render("users/signup");
};

module.exports.signup = async (req, res, next) => {
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
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });

    // res.redirect("/listings");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.getLogInForm = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back to Wanderlust!");
  if (res.locals.reqMethod === "DELETE") {
    return res.redirect(`/listings/${res.locals.listingId}`);
  }

  const redirectUrl = res.locals.redirectUrl || "/listings";

  // delete req.session.redirectUrl;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "LogOut successful!"); // Correct key
    res.redirect("/listings");
  });
};
