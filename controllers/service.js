const Provider = require("../models/provider");
const Booking = require("../models/booking");

const getServicesByType = async (req, res) => {
  try {
    if (!req.isAuthenticated) {
      return res.redirect("/loginUser");
    }
    const serviceType = req.params.type.toLowerCase();
    const services = await Provider.find({ service: serviceType }).select(
      "firmname photos description budget"
    );

    if (services.length === 0) {
      return res.send(`No ${serviceType}s found.`);
    }

    res.render("services", { services: services, serviceType: serviceType });
  } catch (error) {
    console.error(`Error fetching ${req.params.type} services:`, error);
    res.status(500).send("Server Error");
  }
};

// Get a specific service by ID
const getServiceById = async (req, res) => {
  try {
    if (!req.isAuthenticated) {
      return res.redirect("/loginUser");
    }

    const serviceType =
      req.params.type.charAt(0).toUpperCase() + req.params.type.slice(1);
    const service = await Provider.findById(req.params.id).exec();

    if (!service) {
      return res.status(404).send("Service not found.");
    }

    res.render("serviceDetail", { service, serviceType });
  } catch (error) {
    console.error(`Error fetching ${req.params.type} details:`, error);
    res.status(500).send("Server Error");
  }
};

// Book a provider for a specific service type
const bookService = async (req, res) => {
  try {
    if (!req.isAuthenticated) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const providerId = req.params.id;
    const userId = req.user._id;
    const { eventDate } = req.body;

    if (!eventDate) {
      return res.status(400).json({ message: "Event date is required." });
    }

    // Convert the eventDate to a Date object
    const eventDateObj = new Date(eventDate);
    if (isNaN(eventDateObj.getTime())) {
      return res.status(400).json({ message: "Invalid event date." });
    }

    const provider = await Provider.findById(providerId).exec();
    if (!provider) {
      return res.status(404).json({ message: "Provider not found." });
    }

    const serviceType = provider.service;

    // Check if the user has already booked a provider for the same service type and event date
    const existingBooking = await Booking.findOne({
      userId: userId,
      serviceType: serviceType,
      eventDate: eventDateObj,
    }).exec();

    if (existingBooking) {
      return res.status(400).json({
        message: `You have already booked a ${serviceType} for this date.`,
      });
    }

    // Proceed with booking
    const newBooking = new Booking({
      userId,
      providerId,
      serviceType,
      eventDate: eventDateObj,
    });

    await newBooking.save();
    res.status(200).json({ success: true, message: "Booking confirmed!" });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const getUserBookings = async (req, res) => {
  try {
    if (!req.isAuthenticated) {
      return res.redirect("/loginUser");
    }

    const userId = req.user._id;
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const recentBookings = await Booking.find({
      userId: userId,
      createdAt: { $gte: oneDayAgo },
    })
      .populate("providerId")
      .exec();

    const previousBookings = await Booking.find({
      userId: userId,
      createdAt: { $lt: oneDayAgo },
    })
      .populate("providerId")
      .exec();

    res.render("myBookings", {
      recentBookings: recentBookings,
      previousBookings: previousBookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).send("Server Error");
  }
};

// Get bookings for providers
const getProviderBookings = async (req, res) => {
  try {
    if (!req.isAuthenticated || !req.user.isProvider) {
      return res.redirect("/loginProvider");
    }

    const providerId = req.user._id;
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const recentBookings = await Booking.find({
      providerId: providerId,
      createdAt: { $gte: oneDayAgo },
    })
      .populate("userId")
      .exec();

    const previousBookings = await Booking.find({
      providerId: providerId,
      createdAt: { $lt: oneDayAgo },
    })
      .populate("userId")
      .exec();

    res.render("providerBookings", {
      recentBookings: recentBookings,
      previousBookings: previousBookings,
    });
  } catch (error) {
    console.error("Error fetching provider bookings:", error);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getServicesByType,
  getServiceById,
  bookService,
  getUserBookings,
  getProviderBookings,
};
