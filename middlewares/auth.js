const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const verifyToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    console.log("Token not found");
    req.isAuthenticated = false;
    return res.status(401).json({ message: "Not authenticated" });
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Token decoded:", decoded);
    req.user = decoded.user;
    req.isAuthenticated = true;
    next();
  } catch (err) {
    console.log("Error verifying token:", err);
    req.isAuthenticated = false;
    res.status(401).json({ message: "Not authenticated" });
  }
});

module.exports = verifyToken;
