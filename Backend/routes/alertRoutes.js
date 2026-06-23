const express = require("express");
const router = express.Router();
const {
  createAlert,
  getAlerts,
  markAlertRead,
  markAllAlertsRead
} = require("../controllers/alertController");

router.post("/", createAlert);
router.get("/", getAlerts);
router.put("/mark-all-read", markAllAlertsRead);
router.put("/:id/read", markAlertRead);

module.exports = router;