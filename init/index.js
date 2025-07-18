const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const sampleListings = require("./data");
const Listing = require("../models/listingSchema");

// console.log(sampleListings);

// getCoordinates .................

const getCoordinates = require("../getCoordinates");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dburl = process.env.ATLASDB_URL;

// categories array .....
const categories = [
  "Trending",
  "Iconic Cities",
  "Mountains",
  "Castles",
  "Amazing Pools",
  "Camping",
  "Farms",
  "Arctic",
  "Boats",
];

main()
  .then((res) => console.log("connection successful ..."))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dburl);
}
async function work() {
  // Add coordinates - use for...of to wait for each async call
  for (const listing of sampleListings.data) {
    listing.coordinates = await getCoordinates(listing.location);
  }

  async function initDB() {
    try {
      // Delete all existing listings
      await Listing.deleteMany({});
      console.log("All existing listings deleted!");

      // Add owner and category to each listing
      const updatedListings = await Promise.all(
        sampleListings.data.map(async (obj) => ({
          ...obj,
          owner: "681eb7db9729fb3ada9c1b06",
          category: categories[Math.floor(Math.random() * categories.length)],
        }))
      );

      // Insert updated listings
      const insertedData = await Listing.insertMany(updatedListings);
      console.log(`${insertedData.length} sample listings added successfully!`);
    } catch (err) {
      console.error("Error initializing database:", err);
    }
  }

  await initDB(); // Wait for DB init to complete
}

work();
