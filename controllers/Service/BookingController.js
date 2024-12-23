const Booking = require("../../models/booking");
const Provider = require("../../models/provider");

const bookService = async (req, res) => {
  try {
    if (!req.isAuthenticated) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const providerId = req.params.id;
    const userId = req.user._id;
    const { startDateTime, endDateTime } = req.body;

    console.log("User ID:", userId);
    console.log("Provider ID:", providerId);
    console.log("Request Body:", req.body);

    if (!startDateTime || !endDateTime) {
      return res
        .status(400)
        .json({ message: "Event date and time is required." });
    }

    const startEventDateObj = new Date(startDateTime);
    const endEventDateObj = new Date(endDateTime);
    if (
      isNaN(startEventDateObj.getTime()) ||
      isNaN(endEventDateObj.getTime())
    ) {
      return res.status(400).json({ message: "Invalid event date." });
    }

    if (startEventDateObj >= endEventDateObj) {
      return res
        .status(400)
        .json({ message: "Start time must be before end time." });
    }

    const provider = await Provider.findById(providerId).exec();
    if (!provider) {
      return res.status(404).json({ message: "Provider not found." });
    }

    const serviceType = provider.service;

    const existingBooking = await Booking.findOne({
      userId: userId,
      serviceType: serviceType,
      $or: [
        { eventDate: { $gte: startEventDateObj, $lt: endEventDateObj } },
        { endDate: { $gte: startEventDateObj, $lt: endEventDateObj } },
      ],
    }).exec();

    if (existingBooking) {
      return res.status(400).json({
        message: `You have already booked a ${serviceType} for this time period.`,
      });
    }

    const newBooking = new Booking({
      userId,
      providerId,
      serviceType,
      eventDate: startEventDateObj,
      endDate: endEventDateObj,
      status: "pending",
    });

    console.log("New booking object:", newBooking);
    await newBooking.save();
    res.status(200).json({ success: true, message: "Booking request sent!" });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const upcomingBookings = await Booking.find({
      userId: userId,
      eventDate: { $gte: now },
    })
      .populate("providerId")
      .exec();

    const previousBookings = await Booking.find({
      userId: userId,
      eventDate: { $lt: now },
    })
      .populate("providerId")
      .exec();

    console.log("Upcoming Bookings: ", upcomingBookings);
    console.log("Previous Bookings: ", previousBookings);

    res.render("user/previousBookings", {
      upcomingBookings: upcomingBookings,
      previousBookings: previousBookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).send("Server Error");
  }
};

const getProviderEvents = async (req, res) => {
  try {
    const now = new Date();
    const upcomingBookings = await Booking.find({
      providerId: req.user._id,
      status: "confirmed",
      eventDate: { $gte: now },
    })
      .populate("userId", "fullname email")
      .exec();
    const pastBookings = await Booking.find({
      providerId: req.user._id,
      status: "confirmed",
      eventDate: { $lt: now },
    })
      .populate("userId", "fullname email")
      .exec();

    console.log("Upcoming Bookings:", upcomingBookings);
    console.log("Past Bookings:", pastBookings);

    res.render("provider/events", { upcomingBookings, pastBookings });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  bookService,
  getUserBookings,
  getProviderEvents,
};
