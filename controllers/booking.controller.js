const {successResponseBody,errorResponseBody} = require("../utils/responsebody");
const {STATUS} = require("../utils/constants");
const bookingService = require("../services/booking.service");


const create =async (req,res) =>{
    try {
        let userId = req.user._id;
        const response =await bookingService.createBooking({...req.body, userId: userId});//addition of key values and passing as an object
        successResponseBody.message = "Successfully created the booking";
        successResponseBody.data = response;
        return res.status(STATUS.CREATED).json(successResponseBody);
    } catch (error) {
        if(error.err){
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
}

const update =async (req,res) => {
    try {
        const response = await bookingService.updateBooking(req.params.bookingId,req.body);
        successResponseBody.data = response;
        successResponseBody.message = "successfully updated the booking"; 
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        if(error.err){
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
}

const getBookings = async (req,res) => {
    try {
        const response = await bookingService.getBookings({userId: req.userId});
        successResponseBody.data = response;
        successResponseBody.message = "Successfully fetched the bookings";
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        if(error.err){
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
}

const getAllBookings = async (req,res) => {
    try {
        const response = await bookingService.getAllBookings();
        successResponseBody.data = response;
        successResponseBody.message = "Successfully fetched the bookings";
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        if(error.err){
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
}

const getBookingById =async (req,res) => {
    try {
        const response =await bookingService.getBookingById(req.userId,req.params.bookingId);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully fetched the booking details";
        return res.status(STATUS.OK).json(successResponseBody);
    } catch (error) {
        if(error.err){
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
}


module.exports = {
    create,
    update,
    getBookings,
    getAllBookings,
    getBookingById
}