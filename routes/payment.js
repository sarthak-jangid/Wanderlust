const express = require("express");
const router = express.Router({ mergeParams: true });
const paymentProcessController = require("../controllers/paymentProcessController");
const { isLoggedIn } = require("../middlewares");

// Get Razorpay key - no auth needed for this
router.get("/getkey", paymentProcessController.getKey);

// Process payment for a listing
router.post(
  "/listings/:id/payment",
  isLoggedIn,
  paymentProcessController.processPayment
);

module.exports = router;
