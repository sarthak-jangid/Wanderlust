const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const sampleListings = require("./data");
const Listing = require("../models/listingSchema");

// console.log(sampleListings);


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
  "Boats"
];

main()
  .then((res) => console.log("connection successful ..."))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dburl);
}
async function initDB() {
  try {
    // Delete all existing listings
    await Listing.deleteMany({});
    console.log("All existing listings deleted!");

    sampleListings.data = sampleListings.data.map((obj) => ({
      ...obj,
      owner: "681eb7db9729fb3ada9c1b06",
      category : categories[Math.floor(Math.random() * categories.length)],
    }));

    // Insert sample data
    const insertedData = await Listing.insertMany(sampleListings.data);
    console.log(`${insertedData.length} sample listings added successfully!`);
  } catch (err) {
    console.error("Error initializing database:", err);
  }
}

// Run the initialization
initDB();