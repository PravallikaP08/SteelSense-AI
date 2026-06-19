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
    const alerts = await Alert.find();

    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createAlert,
  getAlerts
};