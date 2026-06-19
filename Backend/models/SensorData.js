const mongoose = require("mongoose");

const sensorDataSchema = new mongoose.Schema(
  {
    machineId: {
      type: String,
      required: true
    },
    temperature: {
      type: Number,
      required: true
    },
    pressure: {
      type: Number,
      required: true
    },
    vibration: {
      type: Number,
      required: true
    },
    runtimeHours: {
      type: Number,
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

module.exports = mongoose.model("SensorData", sensorDataSchema);