const Provider = require("../models/provider");
const Booking = require("../models/booking");
const jwt = require("jsonwebtoken");

const isValidInstagramUrl = (url) =>
  /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9(_).]+\/?$/.test(url);

const registerProvider = async (req, res) => {
  try {
    const { social } = req.body;
    if (social && !isValidInstagramUrl(social)) {
      return res.status(400).json({ error: "Invalid Instagram URL" });
    }

    const newProvider = new Provider(req.body);
    if (req.files) {
      if (req.files.profilePhoto)
        newProvider.profilePhoto = req.files.profilePhoto[0].path;
      if (req.files.photos)
        newProvider.photos = req.files.photos.map((file) => file.path);
    }

    await newProvider.save();
    const token = jwt.sign(
      { _id: newProvider.id, isProvider: true },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
    res.cookie("accessToken", token, { httpOnly: true });
    res.status(200).render("provider/success", { provider: newProvider });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginProvider = async (req, res) => {
  try {
    const { email, password } = req.body;
    const provider = await Provider.findOne({ email });
    if (!provider || !(await provider.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { _id: provider.id, isProvider: true },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
    res.cookie("accessToken", token, { httpOnly: true });
    res.status(200).render("provider/success", { provider });
  } catch (error) {
    res.status(500).json({ message: "SERVER ERROR" });
  }
};

const logoutProvider = (req, res) => {
  res.clearCookie("accessToken");
  res.status(200).json({ message: "Logged out successfully" });
};

const setProviderBusyDates = async (req, res) => {
  try {
    const providerId = req.user._id;
    const { busyStartDate, busyEndDate } = req.body;

    // Convert input dates to Date objects
    const startDate = new Date(busyStartDate);
    const endDate = new Date(busyEndDate);

    // Check if end date is greater than or equal to start date
    if (endDate < startDate) {
      return res
        .status(400)
        .json({ error: "End date must be after start date." });
    }

    const busyDatesArr = [];

    // Loop through the date range and add each date to the busyDatesArr
    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      busyDatesArr.push(new Date(d));
    }

    const provider = await Provider.findById(providerId).exec();
    provider.manuallyBusyDates.push(...busyDatesArr);
    await provider.save();
    res.render("provider/setAvailability", {
      busyDates: provider.manuallyBusyDates,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getSetAvailability = async (req, res) => {
  try {
    const providerId = req.user._id;
    const provider = await Provider.findById(providerId);
    res.render("provider/setAvailability", {
      busyDates: provider.manuallyBusyDates,
    });
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

const setAvailableDates = async (req, res) => {
  try {
    const providerId = req.user._id;
    const availableDatesArr = req.body.availableDates
      .split(",")
      .map((date) => new Date(date.trim()));

    const provider = await Provider.findById(providerId).exec();
    provider.manuallyBusyDates = provider.manuallyBusyDates.filter(
      (date) =>
        !availableDatesArr.some(
          (availableDate) =>
            availableDate.toDateString() === date.toDateString()
        )
    );
    await provider.save();
    res.render("provider/setAvailability", {
      busyDates: provider.manuallyBusyDates,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getProviderRequests = async (req, res) => {
  try {
    const requests = await Booking.find({
      providerId: req.user._id,
      status: "pending",
    }).populate("userId", "email name");
    res.render("provider/requests", { requests });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    booking.status = req.body.status;
    await booking.save();

    res
      .status(200)
      .json({ success: true, message: `Request ${req.body.status}.` });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const setManualBusyDates = async (req, res) => {
  try {
    const provider = await Provider.findById(req.user._id);
    provider.manuallyBusyDates.push(
      ...req.body.busyDates.map((date) => new Date(date))
    );
    await provider.save();

    res.status(200).json({ success: true, message: "Dates marked as busy." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getProviderPastBookings = async (req, res) => {
  try {
    const pastBookings = await Booking.find({
      providerId: req.user._id,
      status: "confirmed",
    }).populate("userId", "name email");
    res.render("provider/pastBookings", { pastBookings });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const getEditProfile = async (req, res) => {
  try {
    const provider = await Provider.findById(req.user._id);
    res.render("provider/editProfile", { provider });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updatedData = {};

    if (req.body.email) updatedData.email = req.body.email;
    if (req.body.city) updatedData.city = req.body.city;
    if (req.body.state) updatedData.state = req.body.state;
    if (req.body.country) updatedData.country = req.body.country;
    if (req.files && req.files.profilePhoto) {
      updatedData.profilePhoto = req.files.profilePhoto[0].path;
    }
    if (req.files && req.files.photos) {
      updatedData.photos = req.files.photos.map((file) => file.path);
    }
    const updatedProvider = await Provider.findByIdAndUpdate(
      req.user._id,
      { $set: updatedData },
      { new: true }
    );

    res.status(200).render("provider/success", { provider: updatedProvider });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  registerProvider,
  loginProvider,
  logoutProvider,
  setProviderBusyDates,
  getSetAvailability,
  setAvailableDates,
  getProviderRequests,
  updateRequestStatus,
  setManualBusyDates,
  getProviderPastBookings,
  getEditProfile,
  updateProfile,
};
