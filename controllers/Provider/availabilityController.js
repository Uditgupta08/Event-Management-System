const Provider = require("../../models/provider");

const setProviderBusyDates = async (req, res) => {
  try {
    const providerId = req.user._id;
    const { busyStartDate, busyEndDate } = req.body;

    const startDate = new Date(busyStartDate);
    const endDate = new Date(busyEndDate);

    if (endDate < startDate) {
      return res
        .status(400)
        .json({ error: "End date must be after start date." });
    }

    const busyDatesArr = [];
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

module.exports = {
  setProviderBusyDates,
  getSetAvailability,
  setAvailableDates,
};
