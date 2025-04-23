const express = require("express");
const router = express.Router();
const Listing = require("../models/listingSchema");
const { listingSchema } = require("../Schema");
const ExpressError = require("../utils/ExpressError");

// validation for listing
const validateListing = (req, res, next) => {
  console.log(req.body);

  const { error } = listingSchema.validate(req.body);

  if (error) {
    throw new ExpressError(404, error.message);
  } else {
    next();
  }
};

router.get("/", async (req, res) => {
  try {
    let allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    console.error("Error initializing database:", err);
  }
});

router.get("/new", (req, res) => {
  res.render("listings/new");
});

// create new listing
// post route

router.post("/", validateListing, async (req, res, next) => {
  try {
    // console.log("Request Body:", req.body); // Log the entire request body
    // console.log("Listing:", req.body.listing); // Log the specific property
    if (!req.body.listing) {
      throw new ExpressError(404, "send valid data for listing");
    }

    const newListing = new Listing(req.body.listing);
    await newListing.save();
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
    let listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }
    res.render("listings/show.ejs", { listing });
  } catch (err) {
    next(new ExpressError(404, "Listing not found"));
  }
});

// get the edit form to update listing

router.get("/:id/edit", async (req, res, next) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }
    res.render("listings/edit.ejs", { listing });
  } catch (err) {
    next(new ExpressError(404, "Listing not found"));
  }
});

// update listing ..
// update route

router.put("/:id", validateListing, async (req, res, next) => {
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
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(
      new ExpressError(
        err.statusCode || 500,
        err.message || "Error updating listing"
      )
    );
  }
});
// delete listing ..
// delete route
router.delete("/:id", async (req, res, next) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      return next(new ExpressError(404, "Listing not found"));
    }
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  } catch (err) {
    next(new ExpressError(404, err.message));
  }
});

module.exports = router;
