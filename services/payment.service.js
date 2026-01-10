const Payment = require("../models/payment.model");
const Booking = require("../models/booking.model");
const {STATUS,BOOKING_STATUS,PAYMENT_STATUS} = require("../utils/constants");
const { errorResponseBody } = require("../utils/responsebody");


const createPayment = async (data) => {
    try {
        const booking = await Booking.findById(data.bookingId);
        if(booking.status == BOOKING_STATUS.successfull){
            throw {
                err: "Booking already done, cannot make a new payment against it",
                code: STATUS.FORBIDDEN
            }
        }
        if(!booking){
            throw {
                err:"No booking found",
                code: STATUS.NOT_FOUND
            }
        }
        let bookingTime = booking.createdAt;
        let currentTime = Date.now();
        //calculate how many minutes are remaining
        let minutes = Math.floor(((currentTime-bookingTime)/1000)/60);
        if(minutes>5){
            booking.status = BOOKING_STATUS.expired;
            await booking.save();
            return booking;
        }
        const payment = await Payment.create({
            bookingId: data.bookingId,
            amount: data.amount
        });
        if(payment.amount!=booking.totalCost){
            payment.status = PAYMENT_STATUS.failed;
            booking.status = BOOKING_STATUS.cancelled;
            await booking.save();
            await payment.save();
            return booking;
        }else{
            payment.status = PAYMENT_STATUS.success;
            booking.status = BOOKING_STATUS.successfull;
            await booking.save();
            await payment.save();
            return booking;
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getPaymentById =async (paymentId) => {
    try {
        const response = await Payment.findById(paymentId).populate("bookingId");
        if(!response){
            throw{
                err: "No payment record found",
                code: STATUS.NOT_FOUND
            }
        }
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getAllPayments = async () => {
    try {
        const response = await Payment.find();
        if(!response){
            throw{
                err:"cant fetch the payments",
                code: STATUS.NOT_FOUND
            }
        }
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getAllPaymentsOfUser =async (userId) => {
    try {
        const response = await Payments.findById(userId);
        if(!response){
            throw{
                err: "no user found",
                code: STATUS.NOT_FOUND
            }
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    createPayment,
    getPaymentById,
    getAllPayments,
    getAllPaymentsOfUser
}