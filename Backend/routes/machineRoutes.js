const express = require("express");

const {
  addMachine,
  getMachines,
  updateMachine
} = require("../controllers/machineController");

const router = express.Router();

// Routes
router.post("/", addMachine);
router.get("/", getMachines);
router.put("/:id", updateMachine);

module.exports = router;