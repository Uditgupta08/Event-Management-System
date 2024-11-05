const Provider = require("../../models/provider");
const Booking = require("../../models/booking");

const setProviderBusyDates = async (req, res) => {
  console.log("setProviderBusyDates called");
  try {
    const providerId = req.user._id;
    const { busyStartDate, busyStartTime, busyEndDate, busyEndTime } = req.body;

    const startDateTime = new Date(`${busyStartDate}T${busyStartTime}`);
    const endDateTime = new Date(`${busyEndDate}T${busyEndTime}`);

    if (endDateTime < startDateTime) {
      return res.status(400).json({
        error: "End date and time must be after start date and time.",
      });
    }

    const busyPeriod = { start: startDateTime, end: endDateTime };

    const provider = await Provider.findById(providerId).exec();
    provider.manuallyBusyDates.push(busyPeriod);
    const bookings = await Booking.find({ providerId: providerId }).exec();

    console.log("Existing bookings:", bookings);

    bookings.forEach((booking) => {
      const bookingStart = booking.eventDate;
      const bookingEnd = booking.endDate;

      if (bookingStart && bookingEnd) {
        provider.manuallyBusyDates.push({
          start: bookingStart,
          end: bookingEnd,
        });
        console.log(
          "Added busy period from booking:",
          bookingStart,
          bookingEnd
        );
      }
    });
    await provider.save();
    res.render("provider/setAvailability", {
      busyDates: provider.manuallyBusyDates,
    });
  } catch (error) {
    console.error("Error setting busy dates:", error);
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

    const {
      availableStartDate,
      availableStartTime,
      availableEndDate,
      availableEndTime,
    } = req.body;

    const startDateTime = new Date(
      `${availableStartDate}T${availableStartTime}`
    );
    const endDateTime = new Date(`${availableEndDate}T${availableEndTime}`);

    if (endDateTime <= startDateTime) {
      return res.status(400).json({
        error: "End date and time must be after start date and time.",
      });
    }

    const provider = await Provider.findById(providerId).exec();
    provider.manuallyBusyDates = provider.manuallyBusyDates.filter(
      (busyDate) =>
        !(startDateTime < busyDate.end && endDateTime > busyDate.start)
    );
    provider.availableDates.push({ start: startDateTime, end: endDateTime });

    await provider.save();

    res.render("provider/setAvailability", {
      busyDates: provider.manuallyBusyDates,
    });
  } catch (error) {
    console.error("Error in setAvailableDates:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  setProviderBusyDates,
  getSetAvailability,
  setAvailableDates,
};
