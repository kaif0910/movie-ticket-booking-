const {STATUS} = require("../utils/constants");
const { errorResponseBody } = require("../utils/responsebody");
const ObjectId = require("mongoose").Types.ObjectId;
const theatreService = require("../services/theatre.service");

const validateBookingRequest = async (req,resizeBy,next) => {
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

    //validate movie presence 
    if(!req.body.movieId){
        errorResponseBody.err = "No movie id provided";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if(!ObjectId.isValid(req.body.movieId)){
        errorResponseBody.err = "Invalid movieId format";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    //check if movie is running in that theatre
    if(!theatre.movies.includes(req.body.movieId)){
        errorResponseBody.err ="No movie listed in the given theatre";
        return res.status(STATUS.NOT_FOUND).json(errorResponseBody);
    }

    next();
}