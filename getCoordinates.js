// Install: npm install node-geocoder
const NodeGeocoder = require("node-geocoder");

const options = {
  provider: "openstreetmap",
  httpAdapter: "https",
  userAgent: "MyAirbnbProject/1.0", // Identify your application
  formatter: null
};

const geocoder = NodeGeocoder(options);

async function getCoordinates(locationName) {
  try {
    // Add delay to respect rate limits (1 request per second)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const res = await geocoder.geocode(locationName);
    if (!res || !res.length) {
      console.log(`No coordinates found for: ${locationName}`);
      return null;
    }
    return { lat: res[0].latitude, lng: res[0].longitude };
  } catch (error) {
    console.error(`Error geocoding ${locationName}:`, error.message);
    return null;
  }
}

module.exports = getCoordinates;
