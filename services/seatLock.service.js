const redisClient = require("../utils/redisClient");

const LOCK_TTL = 420; // 7 minutes

const lockSeats = async (showId, seats, userId) => {
  const keys = seats.map(
    seat => `seatlock:${showId}:${seat}`
  );

  //  Check if any seat is already locked
  for (const key of keys) {
    const exists = await redisClient.exists(key);
    if (exists) {
      throw new Error("One or more seats already locked");
    }
  }

  //  Lock all seats
  for (const key of keys) {
    await redisClient.set(
      key,
      JSON.stringify({ userId }),
      { EX: LOCK_TTL }
    );
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
