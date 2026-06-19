const express = require("express");

const {
  addPrediction,
  getPredictions
} = require("../controllers/predictionController");

const router = express.Router();

router.post("/", addPrediction);
router.get("/", getPredictions);

module.exports = router;