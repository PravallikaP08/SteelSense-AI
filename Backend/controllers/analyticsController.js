const SensorData = require("../models/SensorData");
const Alert = require("../models/Alert");
const Machine = require("../models/Machine");

const getAnalytics = async (req, res) => {
  try {
    const sensorData = await SensorData.find();

    let avgTemp = 0;
    let avgPressure = 0;
    let avgVibration = 0;

    if (sensorData.length > 0) {
      avgTemp =
        sensorData.reduce((sum, item) => sum + item.temperature, 0) /
        sensorData.length;

      avgPressure =
        sensorData.reduce((sum, item) => sum + item.pressure, 0) /
        sensorData.length;

      avgVibration =
        sensorData.reduce((sum, item) => sum + item.vibration, 0) /
        sensorData.length;
    }

    const totalAlerts = await Alert.countDocuments();
    const totalMachines = await Machine.countDocuments();

    res.json({
      averageTemperature: avgTemp.toFixed(2),
      averagePressure: avgPressure.toFixed(2),
      averageVibration: avgVibration.toFixed(2),
      totalAlerts,
      totalMachines
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics };