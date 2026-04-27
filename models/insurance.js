const mongoose = require("mongoose");

const insuranceSchema = new mongoose.Schema(
  {
    providerName: {
      type: String,
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
    state: {
      type: String,
      uppercase: true,
      trim: true,
      maxlength: 2,
    },
    coverageType: {
      type: String,
      enum: ["commercial", "medicare", "medicaid", "coupon"],
      required: true,
    },
    relationship: {
      type: String,
      enum: ["self", "dependent"],
      required: true,
    },
    priority: {
      type: Number,
      default: 0,
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

module.exports = mongoose.model("Insurance", insuranceSchema);
