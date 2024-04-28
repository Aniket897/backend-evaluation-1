const { authMiddleware } = require("../middlewares/auth");
const bookModel = require("../models/book.model");
const bookRoutes = require("express").Router();

bookRoutes.post("/", authMiddleware, async (req, resp) => {
  try {
    const { title, author, price } = req.body;
    const { user } = req;
    if (!title || !author) {
      return resp.status(400).json({
        message: "All fields are required",
      });
    }

    const book = await bookModel.create({
      title,
      author,
      price,
      publisher: user,
    });

    resp.status(200).json({
      message: "book added successfully",
      book,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      message: "Internal server error",
    });
  }
});

bookRoutes.patch("/:id", authMiddleware, async (req, resp) => {
  try {
    const { title, author, price } = req.body;
    const { id } = req.params;
    const { user } = req;
    const book = await bookModel.findById(id);

    if (!book) {
      return resp.status(400).json({
        message: "book not found",
      });
    }

    const isUserMatch = book.publisher == user;

    if (!isUserMatch) {
      return resp.status(400).json({
        message: "only owner can update book",
      });
    }

    await bookModel.findByIdAndUpdate(book._id, {
      title,
      author,
      price,
    });

    resp.status(200).json({
      message: "book updated successfully",
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      message: "Internal server error",
    });
  }
});

bookRoutes.delete("/:id", authMiddleware, async (req, resp) => {
  try {
    const { user } = req;
    const { id } = req.params;

    const book = await bookModel.findById(id);

    if (!book) {
      return resp.status(400).json({
        message: "book not found",
      });
    }

    const isUserMatch = book.publisher == user;

    if (!isUserMatch) {
      return resp.status(400).json({
        message: "only owner can delete book",
      });
    }

    await bookModel.findByIdAndDelete(id);

    resp.status(200).json({
      message: "book deleted successfully",
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      message: "Internal server error",
    });
  }
});

bookRoutes.get("/getBooks", async (req, resp) => {
  try {
    const { _limit, _page } = req.query;
    const limit = _limit ? _limit : 10;
    const page = _page ? _page : 1;

    console.log(limit, page);

    const books = await bookModel
      .find({})
      .skip(page * limit - 10)
      .limit(limit);

    resp.status(200).json({
      message: "book fetched successfully",
      books,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      message: "Internal server error",
    });
  }
});

bookRoutes.get("/search", async (req, resp) => {
  try {
    const { query } = req.query;

    const books = await bookModel.find({
      $or: [{ title: { $regex: query } }, { author: { $regex: query } }],
    });

    resp.status(200).json({
      message: "book fetched successfully",
      books,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = bookRoutes;
