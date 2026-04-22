const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema(
  {
    providerName: {
      type: String,
      required: false,
    },

    memberId: {
      type: String,
      required: true,
    },

    bin: {
      type: String,
      required: true,
    },

    pcn: {
      type: String,
      required: true,
    },

    group: {
      type: String,
      required: true,
    },

    coverageType: {
      type: String,
      enum: ["primary", "secondary", "medicaid", "medicare", "commercial"],
      required: true,
    },

    priority: {
      type: Number,
      default: 100,
    },

    isInactivated: {
      type: Boolean,
      default: false,
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Billing', billingSchema)