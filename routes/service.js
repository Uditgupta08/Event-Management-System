const express = require("express");
const serviceRoutes = express.Router();
const { verifyToken } = require("../middlewares/auth");
const {
  bookService,
  getUserBookings,
  getProviderBookings,
} = require("../controllers/Service/BookingController");
const {
  getServicesByType,
  getServiceById,
} = require("../controllers/Service/ServiceContoller");
serviceRoutes.get("/services/:type", verifyToken, getServicesByType);

serviceRoutes.get("/services/:type/:id", verifyToken, getServiceById);

serviceRoutes.post("/bookService/:id", verifyToken, bookService);

serviceRoutes.get("/myBookings", verifyToken, getUserBookings);

serviceRoutes.get("/providerBookings", verifyToken, getProviderBookings);

module.exports = serviceRoutes;
