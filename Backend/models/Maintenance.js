const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    machineId: {
      type: String,
      required: true
    },
    scheduledDate: {
      type: Date,
      required: true
    },
    type: {
      type: String,
      enum: ["Preventative", "Corrective", "Inspection"],
      required: true
    },
    status: {
      type: String,
      enum: ["Scheduled", "In Progress", "Completed", "Cancelled"],
      default: "Scheduled"
    },
    technician: {
      type: String,
      required: true
    },
    notes: {
      type: String,
      default: ""
    },
    completionDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Maintenance", maintenanceSchema);
