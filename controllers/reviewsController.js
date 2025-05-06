const Listing = require("../models/listingSchema");
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/reviewSchema");

module.exports.createReview = async (req, res, next) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }
    const review = new Review(req.body.review);
    if (!review) {
      throw new ExpressError(400, "Invalid review data");
    }
    listing.reviews.push(review);
    review.author = req.user._id;
    await review.save();
    await listing.save();
    req.flash("success", "new review created");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err);
  }
};

module.exports.destroyReview = async (req, res, next) => {
  try {
    let { id, reviewId } = req.params;
    // First check if listing exists
    let listing = await Listing.findById(id);
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }
    // Remove review reference from listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    // Delete the actual review
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "review deleted successfully");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err);
  }
};
