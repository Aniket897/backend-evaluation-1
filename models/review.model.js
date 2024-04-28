const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "description is required"],
    },
    rating: {
      type: Number,
      required: [true, "rating is required"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "userModel",
    },
    book: {
      type: mongoose.Types.ObjectId,
      ref: "bookModel",
    },
  },
  {
    timestamps: true,
  }
);

const reviewModel = mongoose.model("reviews", reviewSchema);

module.exports = reviewModel;
