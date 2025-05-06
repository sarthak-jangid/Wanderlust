const Listing = require("../models/listingSchema");
const ExpressError = require("../utils/ExpressError");

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
    if (!req.body.listing) {
      throw new ExpressError(404, "send valid data for listing");
    }

    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(path,filename);

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New listing created successfully!");
    res.redirect("/listings");
  } catch (err) {
    next(new ExpressError(404, err));
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
    res.render("listings/edit.ejs", { listing });
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
