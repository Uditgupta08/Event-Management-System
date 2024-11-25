const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  console.log("Verifying token for request...");
  if (!token) {
    console.log("Token not found");
    req.isAuthenticated = false;
    return next();
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = { _id: decoded._id, isProvider: decoded.isProvider };
    req.isAuthenticated = true;
    next();
  } catch (err) {
    console.log("Error verifying token:", err);
    req.isAuthenticated = false;
    next();
  }
};

module.exports = { verifyToken };
