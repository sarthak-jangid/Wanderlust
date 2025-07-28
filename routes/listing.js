const express = require("express");
const router = express.Router();

// cloud-config ..
// storage
const { storage } = require("../cloudConfig.js");

//multer ..
const multer = require("multer");
const upload = multer({ storage }); // uploads  ka ak folder banega automatically or fir usme image file save hoga ....

// Controllers ...
const listingsController = require("../controllers/listingsController");
const paymentProcessController = require("../controllers/paymentProcessController");

// require you are loggedIn or not ...............
// validation for listing ........................
// require you are owner of listing or not .......
const { isLoggedIn, isOwner, validateListing } = require("../middlewares");

// index route ................
router.get("/", listingsController.index);

// category route ...............
router.get("/category", listingsController.categoryListing);

// new route form ...........
router.get("/new", isLoggedIn, listingsController.newListingForm);

// create new listing
// post route .......
router.post(
  "/",
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  listingsController.createListing
);

// search route ...........
// search listing
router.get("/search", listingsController.searchListing);

// show the listing details
// show route
router.get("/:id", listingsController.showListing);

// get the edit form to update listing
router.get("/:id/edit", isLoggedIn, isOwner, listingsController.getEditForm);

// update listing ..
// update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  listingsController.updateListing
);
// delete listing ..
// delete route
router.delete("/:id", isLoggedIn, isOwner, listingsController.destroyListing);

// Get Razorpay key route
router.get("/getKey", (req, res) => {
  try {
    res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_API_KEY,
    });
  } catch (error) {
    console.error("Error getting Razorpay key:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get Razorpay key",
    });
  }
});

router.post("/", upload.single("listing[image]"), async (req, res) => {
  try {
    let listing = req.body.listing;

    // Get coordinates before saving
    const coordinates = await getCoordinates(listing.location);
    if (!coordinates) {
      // Provide default coordinates if geocoding fails
      listing.coordinates = { lat: 0, lng: 0 };
    } else {
      listing.coordinates = coordinates;
    }

    const newListing = new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image = { url: result.secure_url, filename: result.public_id };
    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (err) {
    console.error("Error creating listing:", err);
    req.flash("error", "Error creating listing");
    res.redirect("/listings/new");
  }
});

module.exports = router;
