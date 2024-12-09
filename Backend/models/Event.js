const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    startDateTime: {
      type: Date,
      required: true,
    },
    endDateTime: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.startDateTime;
        },
        message: "End time must be after start time",
      },
    },
    location: {
      type: String,
      required: true,
    },
    venue: {
      name: String,
      address: String,
      city: String,
      state: String,
      zipCode: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    category: {
      type: String,
      required: true,
      enum: [
        "conference",
        "workshop",
        "seminar",
        "networking",
        "social",
        "other",
      ],
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    attendees: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        registrationDate: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["confirmed", "waitlisted", "cancelled"],
          default: "confirmed",
        },
      },
    ],
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "cancelled", "completed"],
      default: "published",
    },
    ticketPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    imageUrl: String,
    isPrivate: {
      type: Boolean,
      default: false,
    },
    maxTicketsPerUser: {
      type: Number,
      default: 1,
      min: 1,
    },
    registrationDeadline: Date,
    cancellationPolicy: String,
  },
  {
    timestamps: true,
  }
);

// Virtual field for current attendance count
eventSchema.virtual("attendeeCount").get(function () {
  return this.attendees.filter((a) => a.status === "confirmed").length;
});

// Virtual field to check if event is full
eventSchema.virtual("isFull").get(function () {
  return this.attendeeCount >= this.capacity;
});

// Index for efficient queries
eventSchema.index({ startDateTime: 1, status: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ "venue.city": 1 });

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
