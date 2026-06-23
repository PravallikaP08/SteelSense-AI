const express = require("express");
const router = express.Router();
const {
  getMaintenanceList,
  scheduleMaintenance,
  updateMaintenance
} = require("../controllers/maintenanceController");

// Private/Public routes (we can add auth middleware if needed, but to preserve everything and keep it working, we expose standard routes)
router.get("/", getMaintenanceList);
router.post("/", scheduleMaintenance);
router.put("/:id", updateMaintenance);

module.exports = router;
