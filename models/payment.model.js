const mongoose = require("mongoose");

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
            values: ["success","failed","pending"]
        },
        default: "pending"
    }
},{timestamps: true});


const Payment = mongoose.model("Payment",paymentSchema);

module.exports = Payment;