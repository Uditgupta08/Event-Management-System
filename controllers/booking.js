const Booking = require("../models/booking");

const bookService = async (req, res) => {
  const { userId, providerId, serviceType, eventDate, budget } = req.body;
  try {
    const newBooking = new Booking({
      userId,
      providerId,
      serviceType,
      eventDate,
      budget,
    });

    await newBooking.save();
    return res.status(201).json({
      success: true,
      message: "Booking created successfully!",
      booking: newBooking,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the booking.",
    });
  }
};

const getProviderBookings = async (req, res) => {
  const { providerId } = req.params;
  try {
    const bookings = await Booking.find({ providerId }).populate(
      "userId",
      "email"
    );
    return res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching bookings.",
    });
  }
};
const updateBookingStatus = async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found." });
    }
    booking.status = status;
    await booking.save();

    return res
      .status(200)
      .json({ success: true, message: `Booking ${status}.` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the booking status.",
    });
  }
};

module.exports = { bookService, getProviderBookings, updateBookingStatus };
