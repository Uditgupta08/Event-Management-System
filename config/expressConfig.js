const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const methodOverride = require("method-override");
const path = require("path");

const expressConfig = (app) => {
  app.use(bodyParser.json());
  app.use(cors());
  app.use(cookieParser());
  app.use(methodOverride("_method"));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, "../public")));
  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

  app.set("view engine", "ejs");
  app.use(
    session({
      secret: "key",
      resave: false,
      saveUninitialized: false,
    })
  );
};

module.exports = expressConfig;
