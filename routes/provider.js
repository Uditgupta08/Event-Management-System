const express = require("express");
const {
  registerProvider,
  loginProvider,
  logoutProvider,
  setProviderBusyDates,
  setAvailableDates,
  getProviderRequests,
  updateRequestStatus,
  setManualBusyDates,
  getProviderPastBookings,
  getEditProfile,
  updateProfile,
} = require("../controllers/provider");
const upload = require("../middlewares/multer");
const { verifyToken } = require("../middlewares/auth");

const providerRouter = express.Router();

providerRouter.get("/registerPro", (req, res) => {
  res.render("provider/register");
});

providerRouter.post("/registerPro", upload, registerProvider);

providerRouter.get("/loginPro", (req, res) => {
  res.render("provider/login");
});

providerRouter.post("/loginPro", loginProvider);

providerRouter.get("/logoutPro", logoutProvider);

providerRouter.get(
  "/requests",
  verifyToken,
  getProviderRequests,
  (req, res) => {
    res.render("provider/requests");
  }
);

providerRouter.put("/requests/:bookingId", verifyToken, updateRequestStatus);

providerRouter.get(
  "/past-bookings",
  verifyToken,
  getProviderPastBookings,
  (req, res) => {
    res.render("provider/pastBookings");
  }
);

providerRouter.get("/edit", verifyToken, getEditProfile, (req, res) => {
  res.render("provider/editProfile");
});

providerRouter.post("/update", verifyToken, updateProfile);

providerRouter.post("/set-availability", verifyToken, setProviderBusyDates);
providerRouter.get("/set-manual-busy-dates", verifyToken, (req, res) => {
  res.render("provider/setAvailability");
});
providerRouter.post("/available-dates", verifyToken, setAvailableDates);

providerRouter.post("/set-manual-busy-dates", verifyToken, setManualBusyDates);

module.exports = providerRouter;
