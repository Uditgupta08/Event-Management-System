require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const expressConfig = require("./config/expressConfig");
const { verifyToken } = require("./middlewares/auth");
const routes = require("./routes/index");

const app = express();

connectDB();
expressConfig(app);

app.get("/", verifyToken, (req, res) => {
	if (req.user) {
		return res.render("index", { user: req.user });
	}
	res.render("index", { user: null });
});

app.use("/", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}✌️`);
});
