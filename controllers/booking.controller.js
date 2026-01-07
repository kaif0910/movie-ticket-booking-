const {successResponseBody,errorResponseBody} = require("../utils/responsebody");
const {STATUS} = require("../utils/constants");
const bookingService = require("../services/booking.service");


const create =async (req,res) =>{
    try {
        let userId = req.userId;
        const response =await bookingService.createBooking({...req.body, userId: userId});
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


module.exports = {
    create
}