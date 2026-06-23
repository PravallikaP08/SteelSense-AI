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
    voltage: {
      type: Number,
      default: 220
    },
    rpm: {
      type: Number,
      default: 0
    },
    powerConsumption: {
      type: Number,
      default: 0
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