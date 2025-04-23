const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/reviewSchema");
const { reviewSchema } = require("../Schema");
const Listing = require("../models/listingSchema");
const ExpressError = require("../utils/ExpressError");

// validation for reviews..
const validateReviews = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    throw new ExpressError(404, error.message);
  } else {
    next();
  }
};

// review route
// review listing
router.post("/", validateReviews, async (req, res, next) => {
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
    await review.save();
    await listing.save();
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err);
  }
});

router.delete("/:reviewId", async (req, res, next) => {
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
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
