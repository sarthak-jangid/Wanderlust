// require razorpay
const Razorpay = require("razorpay");

// razorpay payment gateway integration
if (!process.env.RAZORPAY_API_KEY || !process.env.RAZORPAY_API_SECRET) {
  console.error("Razorpay API credentials are not properly configured in environment variables");
  throw new Error("Missing Razorpay credentials");
}

try {
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
  });

  // Verify the instance is created properly
  if (!instance || !instance.orders) {
    throw new Error("Failed to initialize Razorpay instance");
  }

  module.exports = instance;
} catch (error) {
  console.error("Error initializing Razorpay:", error);
  throw error;
}
