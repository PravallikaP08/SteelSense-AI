const Prediction = require("../models/Prediction");
const Alert = require("../models/Alert");

// Add prediction result
const addPrediction = async (req, res) => {
  try {
    const { machineId, failureProbability, healthStatus } = req.body;

    // Save prediction
    const prediction = new Prediction({
      machineId,
      failureProbability,
      healthStatus
    });

    const savedPrediction = await prediction.save();

    // Auto create alert if probability > 80
    if (failureProbability > 80) {
      const alert = new Alert({
        machineId,
        alertType: "Machine Failure Risk",
        severity: "High",
        message: "Machine may fail soon. Maintenance required."
      });

      await alert.save();
    }

    res.status(201).json(savedPrediction);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get all predictions
const getPredictions = async (req, res) => {
  try {
    const predictions = await Prediction.aggregate([
      { $sort: { timestamp: -1 } },
      { $group: { _id: "$machineId", doc: { $first: "$$ROOT" } } },
      { $replaceRoot: { newRoot: "$doc" } },
      { $sort: { machineId: 1 } }
    ]);

    res.status(200).json(predictions);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  addPrediction,
  getPredictions
};