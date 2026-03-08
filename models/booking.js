const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		providerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Provider",
			required: true,
		},
		serviceType: {
			type: String,
			required: true,
		},
		eventDate: {
			type: Date,
			required: true,
		},
		endDate: {
			type: Date,
			required: true,
		},
		status: {
			type: String,
			default: "Pending",
		},
	},
	{ timestamps: true }
);

const Booking =
	mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

module.exports = Booking;
