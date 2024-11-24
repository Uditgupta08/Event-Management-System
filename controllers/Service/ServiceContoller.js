const Provider = require("../../models/provider");

const getServicesByType = async (req, res) => {
  try {
    if (!req.isAuthenticated) {
      return res.status(401).send("Please log in to access this service.");
    }

    const serviceType = req.params.type.toLowerCase();
    const { firmname, state, startDate, startTime, endDate, endTime, sort } =
      req.query;

    const filterConditions = { service: serviceType };
    if (firmname) {
      filterConditions.firmname = { $regex: firmname, $options: "i" };
    }
    if (state) {
      filterConditions.state = { $regex: state, $options: "i" };
    }

    let unavailableProviderIds = [];

    if (startDate && startTime && endDate && endTime) {
      const startDateTime = new Date(`${startDate}T${startTime}`);
      const endDateTime = new Date(`${endDate}T${endTime}`);

      unavailableProviderIds = await Booking.find({
        $or: [
          { eventDate: { $gte: startDateTime, $lt: endDateTime } },
          { endDate: { $gte: startDateTime, $lt: endDateTime } },
        ],
      }).distinct("providerId");

      const busyProviders = await Provider.find({
        manuallyBusyDates: {
          $elemMatch: {
            start: { $lt: endDateTime },
            end: { $gt: startDateTime },
          },
        },
      }).distinct("_id");

      unavailableProviderIds = [
        ...new Set([...unavailableProviderIds, ...busyProviders]),
      ];

      console.log("Unavailable Provider IDs:", unavailableProviderIds);
    }

    filterConditions._id = { $nin: unavailableProviderIds };

    let services = Provider.find(filterConditions).select(
      "firmname profilePhoto description budget rating"
    );

    if (sort === "rating") {
      services = services.sort({ rating: -1 });
    } else if (sort === "budget") {
      services = services.sort({ budget: 1 });
    }

    services = await services.exec();
    const unavailableServices = await Provider.find({
      _id: { $in: unavailableProviderIds },
    }).select("firmname profilePhoto description budget rating");

    res.render("services/services", {
      services,
      serviceType,
      firmname,
      state,
      startDate,
      startTime,
      endDate,
      endTime,
      sort,
      unavailableServices,
    });
  } catch (error) {
    console.error(`Error fetching ${req.params.type} services:`, error);
    res.status(500).send("Server Error");
  }
};

const getServiceById = async (req, res) => {
  try {
    if (!req.isAuthenticated) {
      return res.redirect("user/login");
    }

    const serviceType =
      req.params.type.charAt(0).toUpperCase() + req.params.type.slice(1);
    const service = await Provider.findById(req.params.id).exec();

    if (!service) {
      return res.status(404).send("Service not found.");
    }

    res.render("services/serviceDetail", { service, serviceType });
  } catch (error) {
    console.error(`Error fetching ${req.params.type} details:`, error);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getServicesByType,
  getServiceById,
};
