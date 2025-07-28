// Install: npm install axios
const axios = require("axios");

async function getCoordinates(address) {
  try {
    // Add delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Encode the address for URL
    const encodedAddress = encodeURIComponent(address);
    
    // Make request to Nominatim API
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'AirbnbClone/1.0', // Identify your application
          'Referer': 'https://your-app-domain.com' // Replace with your domain
        }
      }
    );

    // Check if we got results
    if (response.data && response.data.length > 0) {
      const location = response.data[0];
      return {
        lat: parseFloat(location.lat),
        lng: parseFloat(location.lon)
      };
    }

    // Return null if no results found
    console.log(`No coordinates found for address: ${address}`);
    return { lat: 0, lng: 0 };

  } catch (error) {
    console.error('Error getting coordinates:', error.message);
    return { lat: 0, lng: 0 }; // Fallback coordinates
  }
}

module.exports = getCoordinates;
