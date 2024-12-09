const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const {
  registerUser,
  loginUser,
  refreshToken,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  logout,
} = require("../controllers/authController");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshToken);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);

// Protected routes
router.use(verifyToken);
router.post("/logout", logout);

module.exports = router;
