const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const providerSchema = new mongoose.Schema({
  firmname: {
    type: String,
    required: true,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  service: {
    type: String,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  profilePhoto: {
    type: String,
    required: true,
  },
  photos: {
    type: [String],
  },
  social: {
    type: String,
  },
  contact: {
    type: Number,
    required: true,
  },
  website: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  manuallyBusyDates: {
    type: [Date],
  },
  manuallyBusyDates: [
    {
      start: { type: Date },
      end: { type: Date },
    },
  ],

  availableDates: [
    {
      start: Date,
      end: Date,
    },
  ],
});

providerSchema.pre("save", async function (next) {
  const provider = this;
  if (!provider.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(provider.password, salt);
    provider.password = hashedPass;
    next();
  } catch (err) {
    return next(err);
  }
});

providerSchema.methods.comparePassword = async function (candidatePass) {
  try {
    return await bcrypt.compare(candidatePass, this.password);
  } catch (err) {
    throw err;
  }
};

module.exports = mongoose.model("Provider", providerSchema);
