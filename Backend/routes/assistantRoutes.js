const express = require("express");
const router = express.Router();
const { handleAssistantChat } = require("../controllers/assistantController");

router.post("/chat", handleAssistantChat);

module.exports = router;
