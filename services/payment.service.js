const Payment = require("../models/payment.model");
const Booking = require("../models/booking.model");
const redisClient = require("../utils/redisClient");
const {
  STATUS,
  BOOKING_STATUS,
  PAYMENT_STATUS
} = require("../utils/constants");

const createPayment = async (data) => {
  try {
    const booking = await Booking.findById(data.bookingId);

    if (!booking) {
      throw {
        err: "No booking found",
        code: STATUS.NOT_FOUND
      };
    }

    //  Booking already completed
    if (booking.status === BOOKING_STATUS.successfull) {
      throw {
        err: "Booking already completed",
        code: STATUS.FORBIDDEN
      };
    }

    //  Check booking expiry (7 minutes)
    const now = Date.now();
    const createdAt = booking.createdAt.getTime();
    const minutesPassed = Math.floor((now - createdAt) / 60000);

    if (minutesPassed > 7) {
      booking.status = BOOKING_STATUS.expired;
      await booking.save();

      throw {
        err: "Booking expired",
        code: STATUS.BAD_REQUEST
      };
    }

    //  Validate payment amount
    const payment = await Payment.create({
      bookingId: booking._id,
      amount: data.amount,
      status: PAYMENT_STATUS.pending
    });

    if (payment.amount !== booking.totalCost) {
      payment.status = PAYMENT_STATUS.failed;
      booking.status = BOOKING_STATUS.cancelled;

      await payment.save();
      await booking.save();

      return booking;
    }

    //  SUCCESS PAYMENT
    payment.status = PAYMENT_STATUS.success;
    booking.status = BOOKING_STATUS.successfull;

    await payment.save();
    await booking.save();

    //  RELEASE REDIS SEAT LOCKS 🔥
    for (const seat of booking.seats) {
      await redisClient.del(`seatlock:${booking.showId}:${seat}`);
    }

    return booking;

  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  createPayment
};
