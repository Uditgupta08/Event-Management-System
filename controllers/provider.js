const Provider = require("../models/provider");
const Booking = require("../models/booking");
const jwt = require("jsonwebtoken");

const isValidInstagramUrl = (url) => {
  const instagramRegex =
    /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9(_).]+\/?$/;
  return instagramRegex.test(url);
};

const registerProvider = async (req, res) => {
  try {
    const { social } = req.body;
    if (social && !isValidInstagramUrl(social)) {
      return res.status(400).json({ error: "Invalid Instagram URL" });
    }

    const newProvider = new Provider(req.body);

    if (req.files) {
      if (req.files.profilePhoto) {
        newProvider.profilePhoto = req.files.profilePhoto[0].path;
      }
      if (req.files.photos) {
        const photos = req.files.photos.map((file) => file.path);
        newProvider.photos = photos;
      }
    }

    await newProvider.save();

    const token = jwt.sign({ id: newProvider.id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    res.cookie("accessToken", token, { httpOnly: true });
    res.status(200).render("provider/success", { provider: newProvider });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const loginProvider = async (req, res) => {
  const { email, password } = req.body;
  try {
    const provider = await Provider.findOne({ email });
    if (!provider) {
      return res.status(400).json({ message: "Provider not found" });
    }
    const isMatch = await provider.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: provider.id, isProvider: true },
      process.env.SECRET_KEY,
      {
        expiresIn: "1d",
      }
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
    if (!req.isAuthenticated || !req.user.isProvider) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const providerId = req.user._id;
    const { busyDates } = req.body;

    const busyDatesArr = busyDates
      .split(",")
      .map((date) => new Date(date.trim()));

    const provider = await Provider.findById(providerId).exec();
    provider.manuallyBusyDates.push(...busyDatesArr);
    await provider.save();

    res.redirect("/provider/set-availability");
  } catch (error) {
    console.error("Error setting busy dates:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const getSetAvailability = async (req, res) => {
  try {
    const providerId = req.user._id;
    const provider = await Provider.findById(providerId);
    const busyDates = provider.manuallyBusyDates;
    res.render("provider/setAvailability", { busyDates });
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).send("Server Error");
  }
};

const setAvailableDates = async (req, res) => {
  try {
    const providerId = req.user._id;
    const { availableDates } = req.body;

    const availableDatesArr = availableDates
      .split(",")
      .map((date) => new Date(date.trim()));

    const provider = await Provider.findById(providerId).exec();
    provider.manuallyBusyDates = provider.manuallyBusyDates.filter((date) => {
      return !availableDatesArr.some(
        (availableDate) => availableDate.toDateString() === date.toDateString()
      );
    });
    await provider.save();

    res.redirect("/provider/set-availability");
  } catch (error) {
    console.error("Error setting available dates:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const getProviderRequests = async (req, res) => {
  try {
    if (!req.isAuthenticated || !req.user.isProvider) {
      return res.redirect("/loginProvider");
    }

    const providerId = req.user._id;
    const requests = await Booking.find({
      providerId,
      status: "pending",
    }).populate("userId", "email name");

    res.render("provider/requests", { requests });
  } catch (error) {
    console.error("Error fetching provider requests:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateRequestStatus = async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    booking.status = status;
    await booking.save();

    res.status(200).json({ success: true, message: `Request ${status}.` });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const setManualBusyDates = async (req, res) => {
  try {
    const providerId = req.user._id;
    const { busyDates } = req.body;

    const formattedDates = busyDates.map((date) => new Date(date));
    const provider = await Provider.findById(providerId);

    provider.manuallyBusyDates.push(...formattedDates);
    await provider.save();

    res.status(200).json({ success: true, message: "Dates marked as busy." });
  } catch (error) {
    console.error("Error setting busy dates:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const getProviderPastBookings = async (req, res) => {
  try {
    const providerId = req.user._id;
    const pastBookings = await Booking.find({
      providerId,
      status: "confirmed",
    }).populate("userId", "name email");

    res.render("provider/pastBookings", { pastBookings });
  } catch (error) {
    console.error("Error fetching past bookings:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
const getEditProfile = async (req, res) => {
  try {
    if (!req.isAuthenticated || !req.user.isProvider) {
      return res.redirect("/loginProvider");
    }

    const provider = await Provider.findById(req.user._id);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    res.render("provider/editProfile", { provider });
  } catch (error) {
    console.error("Error loading edit profile page:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const providerId = req.user._id;
    const updatedData = req.body;

    if (req.files && req.files.profilePhoto) {
      updatedData.profilePhoto = req.files.profilePhoto[0].path;
    }

    const updatedProvider = await Provider.findByIdAndUpdate(
      providerId,
      updatedData,
      { new: true }
    );

    if (!updatedProvider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    res.redirect("/provider/edit");
  } catch (error) {
    console.error("Error updating profile:", error);
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
