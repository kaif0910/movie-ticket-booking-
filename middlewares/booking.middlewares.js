const {STATUS, USER_ROLE, BOOKING_STATUS} = require("../utils/constants");
const { errorResponseBody } = require("../utils/responsebody");
const ObjectId = require("mongoose").Types.ObjectId;
const theatreService = require("../services/theatre.service");
const userService = require("../services/user.service");

const validateBookingRequest = async (req,res,next) => {
    if(!req.body.theatreId){//validate the theatre id presence 
        errorResponseBody.err = "No theatre id provided";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if(!ObjectId.isValid(req.body.theatreId)){//validate correct theatreId format
        errorResponseBody.err = "Invalid theatre Id provided";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }
    //check if theatre exist in database
    const theatre = await theatreService.getTheatre(req.body.theatreId);
    if(!theatre){
        errorResponseBody.err = "No theatre found for the given theatre Id";
        return res.status(STATUS.NOT_FOUND).json(errorResponseBody);
    }

    //validate show presence 
    if(!req.body.showId){
        errorResponseBody.err = "No show id provided";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if(!ObjectId.isValid(req.body.showId)){
        errorResponseBody.err = "Invalid showId format";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    //check if show is present in that theatre
    if(!theatre.shows.includes(req.body.showId)){
        errorResponseBody.err ="No show listed in the given theatre";
        return res.status(STATUS.NOT_FOUND).json(errorResponseBody);
    }

    //validate presence of seats
    if(!req.body.seats || req.body.seats.length == 0){
        errorResponseBody.err = "No seats selected for booking";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    //request is correct
    next();
}

const canChangeStatus =async (req,res,next) => {
    const user = await userService.userById(req.userId);
    if(user.userRole == USER_ROLE.customer && req.body.status && req.body.status == BOOKING_STATUS.cancelled){// (check again)
        errorResponseBody.err = "You are not allowed to change the booking status";
        return res.status(STATUS.NOT_AUTHORIZED).json(errorResponseBody);
    }

    next();
}

module.exports = {
    validateBookingRequest,
    canChangeStatus
}