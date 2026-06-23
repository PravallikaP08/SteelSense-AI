const Maintenance = require("../models/Maintenance");
const Machine = require("../models/Machine");

// Get all maintenance schedules
const getMaintenanceList = async (req, res) => {
  try {
    const list = await Maintenance.find().sort({ scheduledDate: 1 });
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a scheduled maintenance
const scheduleMaintenance = async (req, res) => {
  try {
    const { machineId, scheduledDate, type, technician, notes } = req.body;

    if (!machineId || !scheduledDate || !type || !technician) {
      return res.status(400).json({ message: "Please enter all required fields" });
    }

    const item = new Maintenance({
      machineId,
      scheduledDate,
      type,
      technician,
      notes
    });

    const saved = await item.save();

    // Optionally set machine status to "Maintenance" if date is today or soon
    await Machine.updateOne({ machineId }, { status: "Maintenance" });

    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update maintenance record (e.g. mark completed)
const updateMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, technician, completionDate } = req.body;

    const record = await Maintenance.findById(id);
    if (!record) {
      return res.status(404).json({ message: "Maintenance record not found" });
    }

    if (status) record.status = status;
    if (notes !== undefined) record.notes = notes;
    if (technician) record.technician = technician;
    if (completionDate) record.completionDate = completionDate;

    if (status === "Completed") {
      record.completionDate = completionDate || new Date();
      // Sync machine status back to "Healthy" or query predictions
      await Machine.updateOne({ machineId: record.machineId }, { status: "Healthy" });
    } else if (status === "Cancelled") {
      await Machine.updateOne({ machineId: record.machineId }, { status: "Healthy" });
    }

    const updated = await record.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMaintenanceList,
  scheduleMaintenance,
  updateMaintenance
};
