// Install: npm install node-geocoder
const NodeGeocoder = require("node-geocoder");

const geocoder = NodeGeocoder({
  provider: "openstreetmap",
});

async function getCoordinates(locationName) {
  const res = await geocoder.geocode(locationName);
  if (!res || !res.length) throw new Error("No geocode result");
  return { lat: res[0].latitude, lng: res[0].longitude };
}


module.exports = getCoordinates;
