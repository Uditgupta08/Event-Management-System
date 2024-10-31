const Provider = require("../../models/provider");

const setProviderBusyDates = async (req, res) => {
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
    const availablePeriodsArr = req.body.availableDates
      .split(",")
      .map((datetime) => new Date(datetime.trim()));

    const provider = await Provider.findById(providerId).exec();
    provider.manuallyBusyDates = provider.manuallyBusyDates.filter(
      (date) =>
        !availablePeriodsArr.some(
          (availableDate) => availableDate.toISOString() === date.toISOString()
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

module.exports = {
  setProviderBusyDates,
  getSetAvailability,
  setAvailableDates,
};
