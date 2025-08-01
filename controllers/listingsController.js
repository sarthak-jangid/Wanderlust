const Listing = require("../models/listingSchema");
const ExpressError = require("../utils/ExpressError");
const getCoordinates = require("../getCoordinates");

module.exports.index = async (req, res) => {
  try {
    // let { path, filename } = req.file;
    let allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    console.error("Error initializing database:", err);
  }
};

module.exports.newListingForm = (req, res) => {
  // console.log(req.user); // it show the user details that is loggedIN
  res.render("listings/new");
};

module.exports.createListing = async (req, res, next) => {
  try {
    // Validate request body
    if (!req.body.listing) {
      throw new ExpressError(400, "Missing listing data");
    }

    // Validate file upload
    if (!req.file) {
      throw new ExpressError(400, "Image is required");
    }

    // Get image details
    const { path: url, filename } = req.file;

    // Get coordinates with error handling
    const coordinates = await getCoordinates(req.body.listing.location);
    if (!coordinates) {
      throw new ExpressError(400, "Invalid location or geocoding failed");
    }

    // Create new listing with validated data
    const newListing = new Listing({
      ...req.body.listing,
      owner: req.user._id,
      image: { url, filename },
      coordinates,
    });

    // Save listing
    await newListing.save();

    // Success response
    req.flash("success", "New listing created successfully!");
    res.redirect("/listings");
  } catch (err) {
    // Better error handling
    if (err instanceof ExpressError) {
      req.flash("error", err.message);
    } else {
      req.flash("error", "Failed to create listing");
      console.error("Listing creation error:", err);
    }
    res.redirect("/listings/new");
  }
};

module.exports.categoryListing = async (req, res) => {
  try {
    let { category } = req.query;
    // console.log(category);
    let allListings = await Listing.find({ category });
    // console.log(allListings);

    let message = "category";

    res.render("listings/index.ejs", { allListings, message });
  } catch (err) {
    console.error("Error initializing database:", err);
  }
};

module.exports.showListing = async (req, res, next) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author", //  nested populating
        },
      })
      .populate("owner"); // populate chaining
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
};

module.exports.getEditForm = async (req, res, next) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }

    let originalImageURL = listing.image.url;
    // console.log(originalImageURL);

    originalImageURL = originalImageURL.replace(
      "/upload",
      "/upload/h_200,w_300"
    );

    res.render("listings/edit.ejs", { listing, originalImageURL });
  } catch (err) {
    req.flash("error", "Listing you requeted for does not exist!");
    res.redirect("/listings");
    // next(new ExpressError(404, "Listing not found"));
  }
};

module.exports.updateListing = async (req, res, next) => {
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
    if (typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
      await listing.save();
    }
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
};

module.exports.destroyListing = async (req, res, next) => {
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
};

// search listing ............................
module.exports.searchListing = async (req, res) => {
  let { country, location } = req.query;
  let allListings = await Listing.find({
    country: country,
    location: location,
  });
  // console.log(allListings);
  res.render("listings/index.ejs", { allListings, message: " Location !" });
};
