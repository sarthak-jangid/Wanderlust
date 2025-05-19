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

module.exports = router;