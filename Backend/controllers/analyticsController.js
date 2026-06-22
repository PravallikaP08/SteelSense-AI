const SensorData = require("../models/SensorData");
const Alert = require("../models/Alert");
const Machine = require("../models/Machine");

const getAnalytics = async (req, res) => {
  try {
    // Get latest sensor data for each machine to compute averages
    const sensorData = await SensorData.aggregate([
      { $sort: { timestamp: -1 } },
      { $group: { _id: "$machineId", doc: { $first: "$$ROOT" } } },
      { $replaceRoot: { newRoot: "$doc" } }
    ]);

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

    // Active alerts (High/Medium) in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const totalAlerts = await Alert.countDocuments({
       timestamp: { $gte: oneHourAgo }
    });
    
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