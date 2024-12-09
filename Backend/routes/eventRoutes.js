const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  rsvpEvent,
  cancelRSVP,
  getEventAttendees,
} = require("../controllers/eventController");

// Public routes
router.get("/public", getAllEvents);

// Protected routes
router.use(verifyToken);
router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.post("/:id/rsvp", rsvpEvent);
router.delete("/:id/rsvp", cancelRSVP);
router.get("/:id/attendees", getEventAttendees);

// Admin routes
router.use(isAdmin);
router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

module.exports = router;
