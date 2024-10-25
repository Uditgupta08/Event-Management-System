const express = require("express");
const {
  registerProvider,
  loginProvider,
  logoutProvider,
} = require("../controllers/provider");
const upload = require("../middlewares/multer");
const { verifyToken } = require("../middlewares/auth");

const providerRouter = express.Router();

providerRouter.get("/registerPro", (req, res) => {
  res.render("provider/register");
});

providerRouter.post("/registerPro", upload, registerProvider);

providerRouter.get("/loginPro", (req, res) => {
  res.render("provider/login");
});

providerRouter.post("/loginPro", loginProvider);

providerRouter.get("/logoutPro", logoutProvider);

module.exports = providerRouter;
