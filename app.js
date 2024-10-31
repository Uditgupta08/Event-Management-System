const express = require("express");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");
const methodOverride = require("method-override");
const connectDB = require("./config/db");
const { verifyToken } = require("./middlewares/auth");
require("dotenv").config();
connectDB();
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  session({
    secret: "key",
    resave: false,
    saveUninitialized: false,
  })
);
const userRoutes = require("./routes/user");
const providerRoutes = require("./routes/provider");
const todoRoutes = require("./routes/todo");
const serviceRoutes = require("./routes/service");

app.use("/", userRoutes);
app.use("/", providerRoutes);
app.use("/", todoRoutes);
app.use("/", serviceRoutes);

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
