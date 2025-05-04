const Listing = require("./models/listingSchema");
const Review = require("./models/reviewSchema");
const { listingSchema } = require("./Schema");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.path + ".." + req.originalUrl)  // it give the url that i want to go but if the  login compelete then login route redirect to the /listings ..
  if (!req.isAuthenticated()) {
    // console.log(req.params.id);
    
    req.session.redirectUrl = req.originalUrl;
    req.session.listingId = req.params.id;
    // console.log(req.method);
    
    req.session.reqMethod = req.method;
    req.flash("error", "you have to login ");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    res.locals.listingId = req.session.listingId;
    res.locals.reqMethod = req.session.reqMethod;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    // console.log(listing.owner);
    // console.log(res.locals.isLoggedIn._id);

    // Check if current user is the owner
    if (!listing.owner.equals(res.locals.isLoggedIn._id)) {
      req.flash("error", "You are not authorized to edit this listing!");
      return res.redirect(`/listings/${id}`);
    }

    next();
  } catch (err) {
    next(new ExpressError(403, "You don't have permission to do that"));
  }
};

module.exports.validateListing = (req, res, next) => {
  // console.log(req.body);

  const { error } = listingSchema.validate(req.body);

  if (error) {
    throw new ExpressError(404, error.message);
  } else {
    next();
  }
};

module.exports.isReviewOwner = async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
      req.flash("error", "Review not found!");
      return res.redirect("/listings");
    }

    if (!review.author._id.equals(req.user._id)) {
      req.flash("error", "You are not authorized to delete this listing!");
      return res.redirect(`/listings/${id}`);
    }
    next();
  } catch (err) {
    next(new ExpressError(403, "You don't have permission to do that"));
  }
};
