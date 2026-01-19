const seatLockService = require("../services/seatLock.service");

const lockSeats = async (req, res) => {
  try {
    const { showId, seats } = req.body;
    const userId = req.user.id;

    await seatLockService.lockSeats(showId, seats, userId);

    res.status(200).json({
      message: "Seats locked successfully",
      expiresIn: "7 minutes"
    });
  } catch (error) {
    console.error(error);

  if (error.err && error.code) {
    return res.status(error.code).json({
      success: false,
      message: error.err
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error"
  });
  }
};

module.exports = {
  lockSeats
};
