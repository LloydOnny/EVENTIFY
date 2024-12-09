const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const {
  getCurrentUser,
  updateProfile,
  updatePassword,
  getRegisteredEvents,
  updatePreferences,
  getAllUsers,
  updateUserStatus,
} = require("../controllers/userController");

// Protected routes
router.use(verifyToken);
router.get("/me", getCurrentUser);
router.put("/profile", updateProfile);
router.put("/password", updatePassword);
router.get("/events", getRegisteredEvents);
router.put("/preferences", updatePreferences);

// Admin routes
router.use(isAdmin);
router.get("/", getAllUsers);
router.put("/:id/status", updateUserStatus);

module.exports = router;
