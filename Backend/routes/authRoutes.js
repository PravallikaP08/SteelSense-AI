const express = require("express");
const { register, login, getMe, googleLogin, updateProfile, logout } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.get("/me", protect, getMe); // Keep for compatibility if any components use it
router.get("/profile", protect, getMe);
router.put("/profile", protect, updateProfile);
router.post("/logout", logout);

module.exports = router;
