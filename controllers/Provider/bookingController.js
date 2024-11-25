const Booking = require("../../models/booking");

const getProviderRequests = async (req, res) => {
  try {
    const requests = await Booking.find({
      providerId: req.user._id,
      status: "pending",
    }).populate("userId", "email fullname");
    console.log(requests);
    res.render("provider/requests", { requests });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// const updateRequestStatus = async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.bookingId);
//     if (!booking) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Booking not found." });
//     }
//     booking.status = req.body.status;
//     await booking.save();
//     res.render("provider/events");
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

const updateRequestStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found." });
    }

    booking.status = req.body.status;
    await booking.save();

    // Fetch updated bookings
    const now = new Date();
    const upcomingBookings = await Booking.find({
      providerId: req.user._id,
      status: "confirmed",
      eventDate: { $gte: now },
    }).populate("userId", "fullname email");

    const pastBookings = await Booking.find({
      providerId: req.user._id,
      status: "confirmed",
      eventDate: { $lt: now },
    }).populate("userId", "fullname email");

    res.render("provider/events", { upcomingBookings, pastBookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
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
  getProviderRequests,
  updateRequestStatus,
  getProviderEvents,
};
