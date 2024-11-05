const express = require("express");
const Provider = require("../models/provider");
const {
  registerProvider,
  loginProvider,
  logoutProvider,
} = require("../controllers/Provider/authController");
const {
  setProviderBusyDates,
  getSetAvailability,
  setAvailableDates,
} = require("../controllers/Provider/availabilityController");
const {
  getProviderRequests,
  updateRequestStatus,
  getProviderEvents,
} = require("../controllers/Provider/bookingController");
const {
  getEditProfile,
  updateProfile,
  setManualBusyDates,
} = require("../controllers/Provider/profileController");
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
providerRouter.get("/home", verifyToken, async (req, res) => {
  try {
    const providerId = req.user._id;
    const provider = await Provider.findById(providerId);
    console.log("Fetched provider:", provider);
    if (!provider) {
      return res.redirect("/");
    }
    res.render("provider/success", { provider });
  } catch (error) {
    console.error("Error fetching provider:", error);
    res.status(500).send("Server error");
  }
});

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
  getProviderEvents,
  (req, res) => {
    res.render("provider/events");
  }
);
providerRouter.get("/edit", verifyToken, getEditProfile, (req, res) => {
  res.render("provider/editProfile");
});
providerRouter.put("/update", verifyToken, upload, updateProfile);

providerRouter.post("/set-availability", verifyToken, setProviderBusyDates);
providerRouter.get(
  "/set-manual-busy-dates",
  verifyToken,
  getSetAvailability,
  (req, res) => {
    res.render("provider/setAvailability");
  }
);
providerRouter.post("/available-dates", verifyToken, setAvailableDates);
providerRouter.post("/set-manual-busy-dates", verifyToken, setManualBusyDates);

module.exports = providerRouter;
