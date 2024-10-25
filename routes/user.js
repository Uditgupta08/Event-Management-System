const express = require("express");
const { registerUser, loginUser, logoutUser } = require("../controllers/user");
const userRouter = express.Router();

userRouter.get("/registerUser", (req, res) => {
  res.render("user/register");
});

userRouter.post("/registerUser", registerUser);

userRouter.get("/loginUser", (req, res) => {
  res.render("user/login");
});

userRouter.post("/loginUser", loginUser);

userRouter.get("/logout", logoutUser);

module.exports = userRouter;
