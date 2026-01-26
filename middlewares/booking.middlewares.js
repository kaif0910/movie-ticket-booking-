const { STATUS, USER_ROLE, BOOKING_STATUS } = require("../utils/constants");
const { errorResponseBody } = require("../utils/responsebody");
const ObjectId = require("mongoose").Types.ObjectId;
const theatreService = require("../services/theatre.service");
const showService = require("../services/show.service");
const userService = require("../services/user.service");

const validateBookingRequest = async (req, res, next) => {
  //  Validate theatreId
  if (!req.body.theatreId) {
    errorResponseBody.err = "No theatre id provided";
    return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
  }

  if (!ObjectId.isValid(req.body.theatreId)) {
    errorResponseBody.err = "Invalid theatre id format";
    return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
  }

  const theatre = await theatreService.getTheatre(req.body.theatreId);
  if (!theatre) {
    errorResponseBody.err = "No theatre found for the given theatre id";
    return res.status(STATUS.NOT_FOUND).json(errorResponseBody);
  }

  //  Validate showId
  if (!req.body.showId) {
    errorResponseBody.err = "No show id provided";
    return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
  }

  if (!ObjectId.isValid(req.body.showId)) {
    errorResponseBody.err = "Invalid show id format";
    return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
  }

  // CORRECT CHECK: show belongs to theatre
  const show = await showService.getShowById(req.body.showId);
  if (!show || String(show.theatreId) !== String(req.body.theatreId)) {
    errorResponseBody.err = "Show does not belong to the given theatre";
    return res.status(STATUS.NOT_FOUND).json(errorResponseBody);
  }

  //  Validate seats
  if (!req.body.seats || !Array.isArray(req.body.seats) || req.body.seats.length === 0) {
    errorResponseBody.err = "No seats selected for booking";
    return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
  }

  next();
};

const canChangeStatus = async (req, res, next) => {
  const user = await userService.userById(req.userId);

  if (
    user.userRole === USER_ROLE.customer &&
    req.body.status === BOOKING_STATUS.cancelled
  ) {
    errorResponseBody.err = "You are not allowed to change the booking status";
    return res.status(STATUS.NOT_AUTHORIZED).json(errorResponseBody);
  }

  next();
};

module.exports = {
  validateBookingRequest,
  canChangeStatus
};
