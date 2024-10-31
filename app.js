const express = require("express");
const connectDB = require("./config/db");
const expressConfig = require("./config/expressConfig");
const { verifyToken } = require("./middlewares/auth");
const routes = require("./routes/index");
require("dotenv").config();

const app = express();

connectDB();
expressConfig(app);

app.use("/", routes);

app.get("/", verifyToken, (req, res) => {
  if (req.user) {
    return res.render("index", { user: req.user });
  }
  res.render("index", { user: null });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
