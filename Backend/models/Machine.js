const mongoose = require("mongoose");

const machineSchema = new mongoose.Schema(
  {
    machineId: {
      type: String,
      required: true,
      unique: true
    },
    machineName: {
      type: String,
      required: true
    },
    machineType: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Maintenance", "Critical", "Warning", "Healthy"],
      default: "Healthy"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Machine", machineSchema);