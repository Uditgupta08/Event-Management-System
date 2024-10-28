const Provider = require("../../models/provider");

const getEditProfile = async (req, res) => {
  try {
    const provider = await Provider.findById(req.user._id);
    res.render("provider/editProfile", { provider });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const updateProfile = async (req, res) => {
  const { email, city, state, country } = req.body;

  const updatedData = {
    email,
    city,
    state,
    country,
  };
  if (req.files) {
    if (req.files.profilePhoto) {
      updatedData.profilePhoto = req.files.profilePhoto[0].path;
    } else {
      updatedData.profilePhoto = req.body.existingProfilePhoto;
    }
  }

  try {
    const updatedProvider = await Provider.findByIdAndUpdate(
      req.user._id,
      { $set: updatedData },
      { new: true }
    );

    res.status(200).render("provider/success", { provider: updatedProvider });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).send("Server error during profile update");
  }
};

const setManualBusyDates = async (req, res) => {
  try {
    const provider = await Provider.findById(req.user._id);
    provider.manuallyBusyDates.push(
      ...req.body.busyDates.map((date) => new Date(date))
    );
    await provider.save();

    res.status(200).json({ success: true, message: "Dates marked as busy." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getEditProfile,
  updateProfile,
  setManualBusyDates,
};
