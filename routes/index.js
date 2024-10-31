const express = require("express");
const providerRouter = require("./provider");
const serviceRouter = require("./service");
const userRouter = require("./user");

const router = express.Router();
router.use("/", userRouter);
router.use("/", providerRouter);
router.use("/", serviceRouter);

module.exports = router;
