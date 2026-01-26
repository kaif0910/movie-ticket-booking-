const Booking = require("../models/booking.model");
const Show = require("../models/show.model");
const Theatre = require("../models/theatre.model");
const {STATUS} = require("../utils/constants")
const redisClient = require("../utils/redisClient");

const createBooking = async (data) => {
  try {
    const { showId, theatreId, userId, seats } = data;

    //  Validate Redis locks (CRITICAL)
    for (const seat of seats) {
      const lockKey = `seatlock:${showId}:${seat}`;
      const lockData = await redisClient.get(lockKey);

      if (!lockData) {
        throw new Error(`Seat ${seat} is not locked`);
      }

      const parsed = JSON.parse(lockData);
      if (parsed.userId !== String(userId)) {
        throw new Error(`Seat ${seat} locked by another user`);
      }
    }

    //  Fetch show
    const show = await Show.findById(showId);
    if (!show) {
      throw new Error("Show not found");
    }

    //  Calculate cost (uniform price)
    const totalCost = seats.length * show.price;

    // Create booking
    const booking = await Booking.create({
      showId,
      theatreId,
      userId,
      seats,
      totalCost
    });

    return booking;

  } catch (error) {
    if(error.code === 11000){
        throw {err: "One or more seats already booked", code: STATUS.CONFLICT};
    }
    throw error;
  }
};

const updateBooking =async (data,bookingId) =>{
    try {
        const response = await Booking.findByIdAndUpdate(data,bookingId,{
            new: true, runValidators: true
        });
        if(!response){
            throw {err: "no booking found with the given booking Id",code: STATUS.NOT_FOUND}
        }
        return response;
    } catch (error) {
        if(error.name == "ValidationError"){
            let err = {};
            Object.keys(error.errors).forEach(key => {
                err[key] = error.errors[key].message;
            });
            throw {err: err, code:STATUS.UNPROCESSIBLE_ENTITY};
        }
        console.log(error);
        throw error;
    }
}

const getBookings = async (data) => {
    try {
        const response = await Booking.find({
        userId: data.userId,
    });
    return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getAllBookings =async () => {
    try {
        const response = await Booking.find();
        return response;
    } catch(error) {
        console.log(error);
        throw error;
    }
}

const getBookingById =async (userId,bookingId) => {
    try {
        const response = await Booking.findById(userId,bookingId);
        if(!response){
            throw{
                err: "No booking records found for the id",
                code: STATUS.NOT_FOUND
            }
        }
        if(response.userId != userId){
            throw{
                err: "Not able to access the booking",
                code: STATUS.NOT_AUTHORIZED
            };
        }
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }

}


module.exports = {
    createBooking,
    updateBooking,
    getBookings,
    getAllBookings,
    getBookingById
}