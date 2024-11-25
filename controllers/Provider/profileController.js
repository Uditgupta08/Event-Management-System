const Provider = require("../../models/provider");

const getEditProfile = async (req, res) => {
  try {
    const provider = await Provider.findById(req.user._id);
    if (!provider) {
      return res.status(404).send("Provider not found");
    }
    res.render("provider/editProfile", { provider });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).send("Server Error");
  }
};

const updateProfile = async (req, res) => {
  const { email, city, state, budget } = req.body;
  const updatedData = { email, city, state, budget };

  try {
    if (req.files && req.files.profilePhoto) {
      // updatedData.profilePhoto = `../uploads/${req.files.profilePhoto[0].filename}`;
      updatedData.profilePhoto = req.files.profilePhoto[0].path;
    }

    const updatedProvider = await Provider.findByIdAndUpdate(
      req.user._id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!updatedProvider) {
      return res.status(404).send("Provider not found");
    }

    res.render("provider/success", { provider: updatedProvider });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).send("Error updating profile");
  }
};

const setManualBusyDates = async (req, res) => {
  try {
    const provider = await Provider.findById(req.user._id);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    const busyDates = req.body.busyDates.map((date) => new Date(date));
    provider.manuallyBusyDates.push(...busyDates);
    await provider.save();

    res.json({ success: true, message: "Dates marked as busy" });
  } catch (error) {
    console.error("Error setting busy dates:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getEditProfile,
  updateProfile,
  setManualBusyDates,
};
