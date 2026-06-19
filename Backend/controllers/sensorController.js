const SensorData = require("../models/SensorData");

// Add sensor data
const addSensorData = async (req, res) => {
  try {
    const { machineId, temperature, pressure, vibration, runtimeHours } =
      req.body;

    const sensorData = new SensorData({
      machineId,
      temperature,
      pressure,
      vibration,
      runtimeHours
    });

    const savedData = await sensorData.save();

    res.status(201).json(savedData);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get all sensor data
const getSensorData = async (req, res) => {
  try {
    const sensorData = await SensorData.find();

    res.status(200).json(sensorData);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  addSensorData,
  getSensorData
};