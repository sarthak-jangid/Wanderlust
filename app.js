const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const PORT = 3000;
const ExpressError = require("./utils/ExpressError");

const listingSchema = require("./listingSchema");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const Listing = require("./models/listingSchema");

main()
  .then((res) => console.log("connection successful ..."))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.get("/", (req, res) => {
  res.send("working ...");
});

app.get("/listings", async (req, res) => {
  try {
    let allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    console.error("Error initializing database:", err);
  }
});

app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);

  if (error) {
    throw new ExpressError(404, error.message);
  } else {
    next();
  }
};

app.post("/listings", validateListing, async (req, res, next) => {
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

app.get("/listings/:id", async (req, res, next) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  } catch (err) {
    next(new ExpressError(404, err));
  }
});

app.get("/listings/:id/edit", async (req, res, next) => {
  try {
    let { id } = req.params;
    // let listing = req.body.listing
    let listing = await Listing.findById(id);
    // console.log(listing);

    res.render("listings/edit.ejs", { listing });
  } catch (err) {
    next(new ExpressError(404, err));
  }
});

app.put("/listings/:id", validateListing, async (req, res) => {
  try {
    let { id } = req.params;
    if (!req.body.listing) {
      throw new ExpressError(404, "send valid data for listing");
    }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(new ExpressError(404, err));
  }
});

app.delete("/listings/:id", async (req, res) => {
  try {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect(`/listings`);
  } catch (err) {
    next(new ExpressError(404, err));
  }
});

app.use((req, res, next) => {
  next(new ExpressError(404, "page not found !"));
});

app.use((err, req, res, next) => {
  // console.log(err)
  // res.status(500).send("something went worng");
  let { statusCode = 500, message = "SOMETHING WENT WRONG!" } = err;
  res.status(statusCode).render("listings/error.ejs", { err });
});

app.listen(PORT, () => {
  console.log("server running ...");
});
