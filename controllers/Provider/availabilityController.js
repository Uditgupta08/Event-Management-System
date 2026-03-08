const Provider = require("../../models/provider");
const Booking = require("../../models/booking");

// const setProviderBusyDates = async (req, res) => {
// 	console.log("setProviderBusyDates called");
// 	try {
// 		const providerId = req.user._id;
// 		const { busyStartDate, busyStartTime, busyEndDate, busyEndTime } = req.body;

// 		const startDateTime = new Date(`${busyStartDate}T${busyStartTime}`);
// 		const endDateTime = new Date(`${busyEndDate}T${busyEndTime}`);

// 		if (endDateTime < startDateTime) {
// 			return res.status(400).json({
// 				error: "End date and time must be after start date and time.",
// 			});
// 		}

// 		const busyPeriod = { start: startDateTime, end: endDateTime };

// 		const provider = await Provider.findById(providerId).exec();
// 		provider.manuallyBusyDates.push(busyPeriod);
// 		const bookings = await Booking.find({ providerId: providerId }).exec();

// 		console.log("Existing bookings:", bookings);

// 		bookings.forEach((booking) => {
// 			const bookingStart = booking.eventDate;
// 			const bookingEnd = booking.endDate;

// 			if (bookingStart && bookingEnd) {
// 				provider.manuallyBusyDates.push({
// 					start: bookingStart,
// 					end: bookingEnd,
// 				});
// 				console.log(
// 					"Added busy period from booking:",
// 					bookingStart,
// 					bookingEnd
// 				);
// 			}
// 		});
// 		await provider.save();
// 		res.render("provider/setAvailability", {
// 			busyDates: provider.manuallyBusyDates,
// 		});
// 	} catch (error) {
// 		console.error("Error setting busy dates:", error);
// 		res.status(500).json({ success: false, message: "Server Error" });
// 	}
// };

const setProviderBusyDates = async (req, res) => {
	try {
		const providerId = req.user._id;
		const { busyStartDate, busyStartTime, busyEndDate, busyEndTime } = req.body;

		const startDateTime = new Date(`${busyStartDate}T${busyStartTime}`);
		const endDateTime = new Date(`${busyEndDate}T${busyEndTime}`);

		if (endDateTime < startDateTime) {
			return res.status(400).json({
				error: "End date and time must be after start date and time.",
			});
		}

		const busyPeriod = { start: startDateTime, end: endDateTime };

		// This function should ONLY add the new manual date.
		// The logic to add booking dates has been moved to getSetAvailability.
		await Provider.findByIdAndUpdate(providerId, {
			$push: { manuallyBusyDates: busyPeriod },
		});

		// Redirect back to the availability page to see the updated list
		res.redirect("/set-manual-busy-dates");
	} catch (error) {
		console.error("Error setting busy dates:", error);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};
// const getSetAvailability = async (req, res) => {
// 	try {
// 		const providerId = req.user._id;
// 		const provider = await Provider.findById(providerId);
// 		const bookings = await Booking.find({
// 			providerId: providerId,
// 			status: "confirmed",
// 		}).exec();
// 		const bookingSlots = bookings.map((booking) => ({
// 			start: booking.eventDate,
// 			end: booking.endDate,
// 		}));
// 		const allBusySlots = [...provider.manuallyBusyDates, ...bookingSlots];

// 		res.render("provider/setAvailability", {
// 			busyDates: provider.allBusySlots,
// 		});
// 	} catch (error) {
// 		res.status(500).send("Server Error");
// 	}
// };

const getSetAvailability = async (req, res) => {
	try {
		const providerId = req.user._id;
		const provider = await Provider.findById(providerId);

		// 1. Fetch all CONFIRMED bookings for this provider
		const bookings = await Booking.find({
			providerId: providerId,
			status: "confirmed", // Only get confirmed bookings
		}).exec();

		// 2. Create a new array with just the start and end times from bookings
		const bookingSlots = bookings.map((booking) => ({
			start: booking.eventDate,
			end: booking.endDate,
		}));

		// 3. Combine the manually set busy dates with the dates from confirmed bookings
		const allBusySlots = [...provider.manuallyBusyDates, ...bookingSlots];

		// 4. Filter out busy dates that are in the past (end date before current date)
		const currentDate = new Date();
		const futureBusySlots = allBusySlots.filter(
			(slot) => slot.end > currentDate
		);

		// 5. Render the page with the filtered list of busy dates
		res.render("provider/setAvailability", {
			busyDates: futureBusySlots,
		});
	} catch (error) {
		console.error("Error getting availability:", error);
		res.status(500).send("Server Error");
	}
};

// const setAvailableDates = async (req, res) => {
// 	try {
// 		const providerId = req.user._id;

// 		const {
// 			availableStartDate,
// 			availableStartTime,
// 			availableEndDate,
// 			availableEndTime,
// 		} = req.body;

// 		const startDateTime = new Date(
// 			`${availableStartDate}T${availableStartTime}`
// 		);
// 		const endDateTime = new Date(`${availableEndDate}T${availableEndTime}`);

// 		if (endDateTime <= startDateTime) {
// 			return res.status(400).json({
// 				error: "End date and time must be after start date and time.",
// 			});
// 		}

// 		const provider = await Provider.findById(providerId).exec();
// 		provider.manuallyBusyDates = provider.manuallyBusyDates.filter(
// 			(busyDate) =>
// 				!(startDateTime < busyDate.end && endDateTime > busyDate.start)
// 		);
// 		provider.availableDates.push({ start: startDateTime, end: endDateTime });

// 		await provider.save();

// 		res.render("provider/setAvailability", {
// 			busyDates: provider.manuallyBusyDates,
// 		});
// 	} catch (error) {
// 		console.error("Error in setAvailableDates:", error);
// 		res.status(500).json({ success: false, message: "Server Error" });
// 	}
// };

const setAvailableDates = async (req, res) => {
	try {
		const providerId = req.user._id;
		const {
			availableStartDate,
			availableStartTime,
			availableEndDate,
			availableEndTime,
		} = req.body;

		const startDateTime = new Date(
			`${availableStartDate}T${availableStartTime}`
		);
		const endDateTime = new Date(`${availableEndDate}T${availableEndTime}`);

		if (endDateTime <= startDateTime) {
			return res.status(400).json({
				error: "End date and time must be after start date and time.",
			});
		}

		const provider = await Provider.findById(providerId).exec();

		// This logic correctly removes any overlapping busy periods
		provider.manuallyBusyDates = provider.manuallyBusyDates.filter(
			(busyDate) =>
				!(startDateTime < busyDate.end && endDateTime > busyDate.start)
		);

		// Note: You have an availableDates array. You might want to use this
		// for now, it's not displayed on the page but the logic is here.
		provider.availableDates.push({ start: startDateTime, end: endDateTime });

		await provider.save();

		// Redirect back to the availability page
		res.redirect("/set-manual-busy-dates");
	} catch (error) {
		console.error("Error in setAvailableDates:", error);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

module.exports = {
	setProviderBusyDates,
	getSetAvailability,
	setAvailableDates,
};
