const mongoose = require("mongoose");
const sampleListings = require("./data");
const Listing = require("../models/listingSchema");

// console.log(sampleListings);

main()
  .then((res) => console.log("connection successful ..."))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
async function initDB() {
  try {
    // Delete all existing listings
    await Listing.deleteMany({});
    console.log("All existing listings deleted!");

    // Insert sample data
    const insertedData = await Listing.insertMany(sampleListings.data);
    console.log(`${insertedData.length} sample listings added successfully!`);
  } catch (err) {
    console.error("Error initializing database:", err);
  }
}

// Run the initialization
initDB();
