const User = require("../models/user");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(200).render("user/success", { user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const accessToken = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: "lax" });
    console.log(req.cookies);
    res.status(200).render("index", { user });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "SERVER ERROR" });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("accessToken");
  res.redirect("/");
};

module.exports = { registerUser, loginUser, logoutUser };
