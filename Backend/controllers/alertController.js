const Alert = require("../models/Alert");

// Create alert
const createAlert = async (req, res) => {
  try {
    const { machineId, alertType, severity, message } = req.body;

    const alert = new Alert({
      machineId,
      alertType,
      severity,
      message
    });

    const savedAlert = await alert.save();

    res.status(201).json(savedAlert);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get all alerts
const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ timestamp: -1 }).limit(30);
    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Mark a single alert as read
const markAlertRead = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }
    res.status(200).json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark all alerts as read
const markAllAlertsRead = async (req, res) => {
  try {
    await Alert.updateMany({ read: false }, { read: true });
    res.status(200).json({ message: "All alerts marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAlert,
  getAlerts,
  markAlertRead,
  markAllAlertsRead
};