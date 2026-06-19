const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    machineId: {
      type: String,
      required: true
    },
    alertType: {
      type: String,
      required: true
    },
    severity: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Alert", alertSchema);