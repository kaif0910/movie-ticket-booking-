const axios = require("axios");
const paymentService = require("../services/payment.service");
const {STATUS,BOOKING_STATUS} = require("../utils/constants");
const { successResponseBody,errorResponseBody } = require("../utils/responsebody");
const User = require("../models/user.model");
const Movie = require("../models/movie.model");
const Theatre = require("../models/theatre.model");
const Show = require("../models/show.model");

const create = async (req, res) => {
  try {
    const booking = await paymentService.createPayment(req.body);

    // Booking expired
    if (booking.status === BOOKING_STATUS.expired) {
      errorResponseBody.err = "The payment took more than 7 minutes to process";
      errorResponseBody.data = booking;
      return res.status(STATUS.GONE).json(errorResponseBody);
    }

    // Booking cancelled
    if (booking.status === BOOKING_STATUS.cancelled) {
      errorResponseBody.err =
        "Payment failed, booking was cancelled. Please try again.";
      errorResponseBody.data = booking;
      return res.status(STATUS.PAYMENT_REQUIRED).json(errorResponseBody);
    }

    // SUCCESS CASE
    const user = await User.findById(booking.userId);
    const show = await Show.findById(booking.showId);
    const movie = await Movie.findById(show.movieId);
    const theatre = await Theatre.findById(booking.theatreId);

    successResponseBody.data = booking;
    successResponseBody.message = "Payment successful. Booking confirmed.";

    // 🔔 Notification (async – don’t block response)
    axios.post(
      `${process.env.NOTI_SERVICE}/notiservice/api/v1/notifications`,
      {
        subject: "🎟️ Your Movie Booking is Confirmed!",
        recepientEmails: [user.email],
        content: `
Your booking is confirmed 🎉

Movie: ${movie.name}
Theatre: ${theatre.name}
Show Time: ${new Date(show.startTime).toLocaleString()}
Seats: ${booking.seats.join(", ")}
Total Paid: ₹${booking.totalCost}

Booking ID: ${booking._id}
        `
      }
    );

    return res.status(STATUS.CREATED).json(successResponseBody);

  } catch (error) {
    if (error.err) {
      errorResponseBody.err = error.err;
      return res.status(error.code).json(errorResponseBody);
    }

    errorResponseBody.err = "Internal server error";
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponseBody);
  }
};


const getPaymentDetailsById = async (req,res) => {
    try {
        const response = await paymentService.getPaymentById(req.params.paymentId);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully fetched the booking and payment details";
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

const getAllPayments = async (req,res) => {
    try {
        const response = await paymentService.getAllPayments(req.user);// can be a problem
        successResponseBody.data = response;
        successResponseBody.message = "Successfully fetched all the payments";
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
    getPaymentDetailsById,
    getAllPayments
}