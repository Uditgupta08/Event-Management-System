const express = require("express");
const serviceRoutes = express.Router();
const { verifyToken } = require("../middlewares/auth");
const {
  bookService,
  getUserBookings,
  getProviderEvents,
} = require("../controllers/Service/BookingController");
const {
  getServicesByType,
  getServiceById,
} = require("../controllers/Service/ServiceContoller");
serviceRoutes.get("/services/:type", verifyToken, getServicesByType);

serviceRoutes.get("/services/:type/:id", verifyToken, getServiceById);

serviceRoutes.post("/bookService/:id", verifyToken, bookService);

serviceRoutes.get("/myBookings", verifyToken, getUserBookings);

serviceRoutes.get(
  "/past-bookings",
  verifyToken,
  getProviderEvents,
  (req, res) => {
    res.render("provider/events");
  }
);

module.exports = serviceRoutes;
