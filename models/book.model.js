const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "title is required"],
  },
  author: {
    type: String,
    required: [true, "auther is required"],
  },
  price: {
    type: Number,
    required: [true, "price is required"],
  },
  publisher: {
    type: mongoose.Types.ObjectId,
    ref: "userModel",
  },
});

const bookModel = mongoose.model("books", bookSchema);

module.exports = bookModel;
