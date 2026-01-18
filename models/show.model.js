const mongoose = require("mongoose");

const showSchema = new mongoose.Schema(
  {
    theatreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theatre",
      required: true
    },

    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true
    },

    timing:{
        type: String,
        required: true
    },

    noOfSeats:{
        type: Number,
        required: true
    },

    price:{
        type: Number,
        required: true
    },

    format: {
      type: String,
      enum: ["2D", "3D", "IMAX"],
      default: "2D"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Show", showSchema);
