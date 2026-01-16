const mongoose = require("mongoose");
const { BOOKING_STATUS } = require("../utils/constants");

const bookingSchema = new mongoose.Schema(
  {
    theatreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theatre",
      required: true
    },

    showId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    seats: {
      type: [String], // ["A1", "A2"]
      required: true
    },

    totalCost: {
      type: Number,
      required: true
    },

    paymentId: {
      type: String
    },

    status: {
      type: String,
      enum: [
        BOOKING_STATUS.processing,
        BOOKING_STATUS.cancelled,
        BOOKING_STATUS.successfull,
        BOOKING_STATUS.expired
      ],
      default: BOOKING_STATUS.processing
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
