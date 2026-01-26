const express = require("express");
const { errorResponseBody } = require("../utils/responsebody");
const { STATUS } = require("../utils/constants");
const ObjectId = require("mongoose").Types.ObjectId;

const validateCreateShowRequest = (req,res,next) => {
    if(!req.body.theatreId){
        errorResponseBody.err = "No theatreId provided";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    if(!ObjectId.isValid(req.body.theatreId)){
        errorResponseBody.err = "Invalid theatreId provided";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }


    if(!req.body.movieId){
        errorResponseBody.err = "No movieId provided";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    } 

    if(!ObjectId.isValid(req.body.movieId)){
        errorResponseBody.err = "Invalid movieId provided";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    
    // if(!req.body.timing){
    //     errorResponseBody.err = "No timing provided";
    //     return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    // }

    // if(!req.body.price){
    //     errorResponseBody.err = "No price provided";
    //     return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    // }

    if(!req.body.format){
        errorResponseBody.err = "No format provided";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }

    next();
}

const validateUpdateShowRequest = (req,res,next) => {
    if(req.body.theatreId || req.body.movieId){
        errorResponseBody.err = "we cannot update theatreId or movieId for an already added show";
        return res.status(STATUS.BAD_REQUEST).json(errorResponseBody);
    }
    next();
}


module.exports = {
    validateCreateShowRequest,
    validateUpdateShowRequest
}