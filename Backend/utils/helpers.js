const SensorData = require("../models/SensorData");
const Prediction = require("../models/Prediction");
const Alert = require("../models/Alert");

// Generate random sensor data
const generateSensorData = async () => {
  try {
    // Generate sensor values
    const temperature = Math.floor(Math.random() * 40) + 60;
    const pressure = Math.floor(Math.random() * 20) + 20;
    const vibration = Math.floor(Math.random() * 15) + 5;
    const runtimeHours = Math.floor(Math.random() * 500) + 100;

    // Save sensor data
    const sensor = new SensorData({
      machineId: "M001",
      temperature,
      pressure,
      vibration,
      runtimeHours
    });

    await sensor.save();

    // Simple prediction logic
    let failureProbability = 20;

    if (temperature > 85) failureProbability += 30;
    if (pressure > 35) failureProbability += 20;
    if (vibration > 15) failureProbability += 30;

    let healthStatus = "Healthy";

    if (failureProbability > 80) {
      healthStatus = "Critical";
    } else if (failureProbability > 50) {
      healthStatus = "Warning";
    }

    // Save prediction
    const prediction = new Prediction({
      machineId: "M001",
      failureProbability,
      healthStatus
    });

    await prediction.save();

    // Auto create alert
    if (failureProbability > 80) {
      const alert = new Alert({
        machineId: "M001",
        alertType: "Machine Failure Risk",
        severity: "High",
        message: "Machine may fail soon. Maintenance required."
      });

      await alert.save();
    }

    console.log(
      `Sensor Saved | Temp:${temperature}°C | Prediction:${failureProbability}% | Status:${healthStatus}`
    );
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = generateSensorData;