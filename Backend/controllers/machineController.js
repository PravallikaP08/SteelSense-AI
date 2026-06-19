const Machine = require("../models/Machine");

// Add new machine
const addMachine = async (req, res) => {
  try {
    const { machineId, machineName, machineType, status } = req.body;

    const machine = new Machine({
      machineId,
      machineName,
      machineType,
      status
    });

    const savedMachine = await machine.save();

    res.status(201).json(savedMachine);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get all machines
const getMachines = async (req, res) => {
  try {
    const machines = await Machine.find();

    res.status(200).json(machines);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Update machine status
const updateMachine = async (req, res) => {
  try {
    const machine = await Machine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(machine);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  addMachine,
  getMachines,
  updateMachine
};