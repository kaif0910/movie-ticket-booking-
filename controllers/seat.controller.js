const seatLockService = require("../services/seatLock.service");

const lockSeats = async (req, res) => {
  try {
    const { showId, seatIds } = req.body;
    const userId = req.user.id;

    await seatLockService.lockSeats(showId, seatIds, userId);

    res.status(200).json({
      message: "Seats locked successfully",
      expiresIn: "7 minutes"
    });
  } catch (err) {
    res.status(409).json({
      error: err.message
    });
  }
};

module.exports = {
  lockSeats
};
