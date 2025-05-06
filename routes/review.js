const express = require("express");
const router = express.Router({ mergeParams: true });
// const { reviewSchema } = require("../Schema");
const Listing = require("../models/listingSchema");
const ExpressError = require("../utils/ExpressError");
// validation for reviews // isLoggedIn // isReviewOwner ..
const {
  isLoggedIn,
  isReviewOwner,
  validateReviews,
} = require("../middlewares");

// review controller ..
const reviewController = require('../controllers/reviewsController')

// review route
// review listing
router.post("/", isLoggedIn, validateReviews, reviewController.createReview );

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewOwner,
  reviewController.destroyReview
);

module.exports = router;