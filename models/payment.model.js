const mongoose = require("mongoose");
const {PAYMENT_STATUS} = require("../utils/constants");

const paymentSchema = new mongoose.Schema({
    bookingId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Booking"
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: [PAYMENT_STATUS.success,PAYMENT_STATUS.failed,PAYMENT_STATUS.pending],
            message: "Invalid payment status"
        },
        default: PAYMENT_STATUS.pending
    }
},{timestamps: true});


const Payment = mongoose.model("Payment",paymentSchema);

module.exports = Payment;