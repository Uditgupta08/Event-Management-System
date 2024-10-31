const Booking = require("../../models/booking");

const getProviderRequests = async (req, res) => {
  try {
    const requests = await Booking.find({
      providerId: req.user._id,
      status: "Pending",
    }).populate("userId", "email fullname");
    console.log(requests);
    res.render("provider/requests", { requests });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

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

    res
      .status(200)
      .json({ success: true, message: `Request ${req.body.status}.` });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getProviderPastBookings = async (req, res) => {
  try {
    const pastBookings = await Booking.find({
      providerId: req.user._id,
      status: "confirmed",
    }).populate("userId", "fullname email");
    res.render("provider/pastBookings", { pastBookings });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getProviderRequests,
  updateRequestStatus,
  getProviderPastBookings,
};
