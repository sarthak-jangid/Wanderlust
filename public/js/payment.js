// Validate nights input
function validateNights(input) {
  const value = parseInt(input.value);
  const errorDiv = document.getElementById("nightsError");
  const submitBtn = document.getElementById("bookBtn");

  if (isNaN(value) || value < 1 || value > 29) {
    input.classList.add("is-invalid");
    errorDiv.style.display = "block";
    submitBtn.disabled = true;
    return false;
  } else {
    input.classList.remove("is-invalid");
    errorDiv.style.display = "none";
    submitBtn.disabled = false;
    return true;
  }
}

// Handle form submission
document
  .getElementById("book-listing-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const nightsInput = document.getElementById("nights");
    if (!validateNights(nightsInput)) {
      return; // Stop if validation fails
    }

    const nights = parseInt(nightsInput.value);
    try {
      // First get the Razorpay key
      const { data: keyData } = await axios.get("/getkey");
      console.log("Response from key endpoint:", keyData);

      if (!keyData || !keyData.success || !keyData.key) {
        throw new Error("Invalid key response from server");
      }

      // console.log("Razorpay key retrieved successfully");

      // Then create the order
      const { data: orderData } = await axios.post(
        `/listings/${listing._id}/payment`,
        { nights },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!orderData.success) {
        throw new Error(orderData.message || "Payment failed");
      }

      // Initialize Razorpay
      const options = {
        key: keyData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: listing.title,
        description: `${nights} night${nights > 1 ? "s" : ""} stay`,
        order_id: orderData.order.id,
        handler: function (response) {
          alert("Payment successful! Order ID: " + response.razorpay_order_id);
          window.location.href = `/listings/${listing._id}`;
        },
        modal: {
          ondismiss: function () {
            console.log("Payment window closed");
          },
        },
        prefill: {
          name: listing.title,
        },
        notes: {
          listing_id: listing._id,
          nights: nights,
        },
        theme: {
          color: "#0d6efd",
        },
      };

      const rzp = new Razorpay(options);
      rzp.on("payment.failed", function (response) {
        alert(response.error.description);
      });
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to process payment. Please try again."
      );
    }
  });
