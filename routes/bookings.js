const express = require("express");
const router = express.Router();
const {
  bookService,
  getProviderBookings,
  updateBookingStatus,
} = require("../controllers/booking");

router.post("/bookService/:providerId", bookService);

router.get("/provider/:providerId/bookings", getProviderBookings);

router.put("/bookings/:bookingId/status", updateBookingStatus);

module.exports = router;
