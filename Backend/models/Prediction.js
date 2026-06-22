const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
    machineId: {
      type: String,
      required: true
    },
    failureProbability: {
      type: Number,
      required: true
    },
    healthStatus: {
      type: String,
      enum: ["Healthy", "Warning", "Critical"],
      required: true
    },
    recommendation: {
      type: String,
      default: "System healthy."
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

module.exports = mongoose.model("Prediction", predictionSchema);