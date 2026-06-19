const Machine = require("../models/Machine");
const SensorData = require("../models/SensorData");
const Prediction = require("../models/Prediction");
const Alert = require("../models/Alert");

// Get dashboard summary
const getDashboardSummary = async (req, res) => {
  try {
    const totalMachines = await Machine.countDocuments();

    const totalSensorRecords = await SensorData.countDocuments();

    const totalPredictions = await Prediction.countDocuments();

    const totalAlerts = await Alert.countDocuments();

    res.status(200).json({
      totalMachines,
      totalSensorRecords,
      totalPredictions,
      totalAlerts
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getDashboardSummary
};