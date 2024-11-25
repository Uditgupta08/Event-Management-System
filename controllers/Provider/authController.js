const Provider = require("../../models/provider");
const jwt = require("jsonwebtoken");
const path = require("path");
const isValidInstagramUrl = (url) =>
  /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9(_).]+\/?$/.test(url);

const registerProvider = async (req, res) => {
  try {
    const { social } = req.body;
    if (social && !isValidInstagramUrl(social)) {
      return res.status(400).json({ error: "Invalid Instagram URL" });
    }

    const newProvider = new Provider(req.body);
    if (req.files) {
      if (req.files.profilePhoto) {
        newProvider.profilePhoto = req.files.profilePhoto[0].path;
      }
      if (req.files.photos) {
        newProvider.photos = req.files.photos.map((file) => file.path);
      }
    }
    // const uploadDir = path.join(__dirname, "../uploads");
    // if (req.files) {
    //   if (req.files.profilePhoto) {
    //     newProvider.profilePhoto = path
    //       .relative(
    //         path.join(__dirname, "../uploads"),
    //         req.files.profilePhoto[0].path
    //       )
    //       .replace(/\\/g, "/");
    //   }
    //   if (req.files.photos) {
    //     newProvider.photos = req.files.photos.map((file) =>
    //       path
    //         .relative(path.join(__dirname, "../uploads"), file.path)
    //         .replace(/\\/g, "/")
    //     );
    //   }
    // }

    await newProvider.save();
    const token = jwt.sign(
      { _id: newProvider.id, isProvider: true },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
    res.cookie("accessToken", token, { httpOnly: true });
    res.status(200).render("provider/success", { provider: newProvider });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginProvider = async (req, res) => {
  try {
    const { email, password } = req.body;
    const provider = await Provider.findOne({ email });

    if (!provider || !(await provider.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { _id: provider.id, isProvider: true },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
    res.cookie("accessToken", token, { httpOnly: true });
    res.status(200).render("provider/success", { provider });
  } catch (error) {
    res.status(500).json({ message: "SERVER ERROR" });
  }
};

const logoutProvider = (req, res) => {
  res.clearCookie("accessToken");
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {
  registerProvider,
  loginProvider,
  logoutProvider,
};
