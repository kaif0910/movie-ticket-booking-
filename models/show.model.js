const mongoose = require("mongoose");

const showSchema = new mongoose.Schema(
  {
    theatreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theatre",
      required: true
    },

    // audiId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Audi",
    //   required: true
    // },

    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true
    },

    // startTime: {
    //   type: Date,
    //   required: true
    // },

    // endTime: {
    //   type: Date,
    //   required: true
    // },

    // priceMap: {
    //   GOLD: { type: Number, required: true },
    //   SILVER: { type: Number, required: true },
    //   PLATINUM: { type: Number, required: true }
    // },

    timing:{
        type: String,
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
