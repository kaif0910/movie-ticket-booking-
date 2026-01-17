const redisClient = require("../utils/redisClient");

const LOCK_TTL = 420; // 7 minutes

const lockSeats = async (showId, seatIds, userId) => {
  const keys = seatIds.map(
    seat => `seatlock:${showId}:${seat}`
  );

  // 1️⃣ Check if any seat is already locked
  for (const key of keys) {
    const exists = await redisClient.exists(key);
    if (exists) {
      throw new Error("One or more seats already locked");
    }
  }

  // 2️⃣ Lock all seats
  for (const key of keys) {
    await redisClient.set(
      key,
      JSON.stringify({ userId }),
      { EX: LOCK_TTL }
    );
  }

  return true;
};

const unlockSeats = async (showId, seatIds) => {
  for (const seat of seatIds) {
    await redisClient.del(`seatlock:${showId}:${seat}`);
  }
};

module.exports = {
  lockSeats,
  unlockSeats
};
