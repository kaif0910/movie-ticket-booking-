const mongoose = require('mongoose');
const Theatre = require('./theatre.model');
const Movie = require('./movie.model');
const Show = require('./show.model');

const seatTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["GOLD", "SILVER", "PLATINUM"],
    required: true
  },
  priceMultiplier: {
    type: Number,
    default: 1
  }
}, { _id: false });


const rowSchema = new mongoose.Schema({
  rowLabel: {
    type: String, // A, B, C
    required: true
  },
  seatCount: {
    type: Number,
    required: true
  },
  seatType: {
    type: String,
    enum: ["GOLD", "SILVER", "PLATINUM"],
    required: true
  }
}, { _id: false });


const audiSchema = mongoose.Schema({
    theatreId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theatre",
    required: true
  },
  name: {
    type: String, // Audi 1,etc
    required: true
  },
  rows: {
    type: [rowSchema],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Audi",audiSchema)