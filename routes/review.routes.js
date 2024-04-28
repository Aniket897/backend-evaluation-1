const { authMiddleware } = require("../middlewares/auth");
const reviewModel = require("../models/review.model");
const reviewRoutes = require("express").Router();

reviewRoutes.post("/:bookId", authMiddleware, async (req, resp) => {
  try {
    const { description, rating } = req.body;
    const { user } = req;
    const { bookId } = req.params;

    if (!description || !rating) {
      return resp.status(400).json({
        message: "All fields are required",
      });
    }

    /*
      cheking if review already given
    */

    const alreadyGiven = await reviewModel.findOne({
      $and: [{ book: bookId }, { user }],
    });

    if (alreadyGiven) {
      return resp.status(400).json({
        message: "you have given review already",
      });
    }

    const review = await reviewModel.create({
      description,
      rating,
      user,
      book: bookId,
    });

    resp.status(200).json({
      message: "review created successfully",
      review,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      message: "Internal server error",
    });
  }
});

reviewRoutes.delete("/:id", async (req, resp) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const review = await reviewModel.findById(id);

    if (!review) {
      return resp.status(400).json({
        message: "review not found",
      });
    }

    const isUserMatch = review.user == user;

    if (!isUserMatch) {
      return resp.status(400).json({
        message: "only owner can delete review",
      });
    }

    await reviewModel.findByIdAndDelete(id);

    resp.status(200).json({
      message: "review deleted successfully",
    });

  } catch (error) {
    console.log(error);
    resp.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = reviewRoutes;
