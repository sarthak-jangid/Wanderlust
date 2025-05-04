const express = require("express");
const router = express.Router();
const Listing = require("../models/listingSchema");
const { listingSchema } = require("../Schema");
const ExpressError = require("../utils/ExpressError");

// require you are loggedIn or not ...............
// validation for listing ........................
// require you are owner of listing or not .......
const { isLoggedIn, isOwner, validateListing } = require("../middlewares");

// index route ................
router.get("/", async (req, res) => {
  try {
    let allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    console.error("Error initializing database:", err);
  }
});

// new route form ...........
router.get("/new", isLoggedIn, (req, res) => {
  // console.log(req.user); // it show the user details that is loggedIN
  res.render("listings/new");
});

// create new listing
// post route .......
router.post("/", isLoggedIn, validateListing, async (req, res, next) => {
  try {
    if (!req.body.listing) {
      throw new ExpressError(404, "send valid data for listing");
    }

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing created successfully!");
    res.redirect("/listings");
  } catch (err) {
    next(new ExpressError(404, err));
  }
});

// show the listing details
// show route
router.get("/:id", async (req, res, next) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author", //  nested populating
        },
      })
      .populate("owner");  // populate chaining
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }
    // console.log(listing.owner.username);

    res.render("listings/show.ejs", { listing });
  } catch (err) {
    req.flash("error", "Listing you requeted for does not exist!");
    res.redirect("/listings");
    // next(new ExpressError(404, "Listing not found"));
  }
});

// get the edit form to update listing

router.get("/:id/edit", isLoggedIn, isOwner, async (req, res, next) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }
    res.render("listings/edit.ejs", { listing });
  } catch (err) {
    req.flash("error", "Listing you requeted for does not exist!");
    res.redirect("/listings");
    // next(new ExpressError(404, "Listing not found"));
  }
});

// update listing ..
// update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  async (req, res, next) => {
    try {
      let { id } = req.params;
      if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing");
      }
      const listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { new: true }
      );
      if (!listing) {
        throw new ExpressError(404, "Listing not found");
      }
      req.flash("success", "Listing updated successfully!");
      res.redirect(`/listings/${id}`);
    } catch (err) {
      next(
        new ExpressError(
          err.statusCode || 500,
          err.message || "Error updating listing"
        )
      );
    }
  }
);
// delete listing ..
// delete route
router.delete("/:id", isLoggedIn, isOwner, async (req, res, next) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      return next(new ExpressError(404, "Listing not found"));
    }
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
  } catch (err) {
    next(new ExpressError(404, err.message));
  }
});

module.exports = router;
