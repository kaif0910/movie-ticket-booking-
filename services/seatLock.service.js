const redisClient = require("../utils/redisClient");
const Booking = require("../models/booking.model");

const LOCK_TTL = 420; // 7 minutes

const lockSeats = async (showId, seats, userId) => {

  // 1️⃣ HARD BLOCK: already booked seats (PERMANENT)
  const alreadyBooked = await Booking.findOne({
    showId,
    seats: { $in: seats },
    status: {
      $nin: ["cancelled", "expired"]
    }
  });

  if (alreadyBooked) {
    throw {
      err: "One or more seats are already booked",
      code: 409
    };
  }

  // 2️⃣ ATOMIC Redis locking (NO race condition)
  for (const seat of seats) {
    const key = `seatlock:${showId}:${seat}`;

    const result = await redisClient.set(
      key,
      JSON.stringify({ userId }),
      {
        NX: true,   // 🔥 atomic
        EX: LOCK_TTL
      }
    );

    if (!result) {
      throw {
        err: "One or more seats are already locked",
        code: 409
      };
    }
  }

  return true;
};

const unlockSeats = async (showId, seats) => {
  for (const seat of seats) {
    await redisClient.del(`seatlock:${showId}:${seat}`);
  }
};

module.exports = {
  lockSeats,
  unlockSeats
};
