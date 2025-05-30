const Listing = require("../models/listingSchema.js");
const instance = require("../razorpayConfig.js");
const ExpressError = require("../utils/ExpressError");

// Get Razorpay Key
module.exports.getKey = (req, res) => {
  try {
    if (!process.env.RAZORPAY_API_KEY) {
      throw new Error("Razorpay API key not configured");
    }
    res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_API_KEY,
    });
  } catch (error) {
    console.error("Error retrieving Razorpay key:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get payment configuration",
    });
  }
};

module.exports.processPayment = async (req, res, next) => {
  try {
    let { id: listingId } = req.params;
    // Validate the Razorpay instance
    if (!instance || !instance.orders) {
      console.error("Razorpay instance not properly initialized");
      return res.status(500).json({
        success: false,
        message: "Payment service not properly configured",
      });
    }

    // Log the incoming request
    console.log("Payment request received:", {
      body: req.body,
      headers: {
        "content-type": req.headers["content-type"],
      },
    });
    // Check if the request body is empty
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is empty. Please provide payment details.",
      });
    }
    // Check if the listing ID is provided
    if (!listingId) {
      return res.status(400).json({
        success: false,
        message: "Listing ID is required to process payment",
      });
    }
    // get the listing details from the database
    const listing = await Listing.findById(listingId);
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }
    console.log("Listing found:", listing.price);

    // Validate request body
    let nights = req.body.nights;
    let amount = listing.price * nights; // Assuming price is an object with amount property
    if (!amount || isNaN(amount)) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount. Please provide a valid number",
      });
    }

    const options = {
      amount: amount * 100, // Convert to paise and ensure it's an integer
      currency: "INR", // Assuming INR for Indian Rupees
      receipt: `order_${Date.now()}`,
      payment_capture: 1,
    };

    console.log("Creating order with options:", options);

    const order = await instance.orders.create(options);
    console.log("Order created successfully:", order);

    res.status(200).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (err) {
    next(new ExpressError(404, err));
  }
};
