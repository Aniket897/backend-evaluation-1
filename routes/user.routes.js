const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middlewares/auth");

const userRoutes = require("express").Router();

userRoutes.post("/register", async (req, resp) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return resp.status(400).json({
        message: "All fields are required",
      });
    }
    const user = await userModel.findOne({ email });

    if (user) {
      return resp.status(400).json({
        message: "account alredy exist with provided email please try to login",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.create({ email, password: hashedPassword, name });

    resp.status(200).json({
      message: "Registeration successfull",
    });
  } catch (error) {
    resp.status(500).json({
      message: "Internal server error",
    });
  }
});

userRoutes.post("/login", async (req, resp) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return resp.status(400).json({
        message: "All fields are required",
      });
    }
    const user = await userModel.findOne({ email });

    if (!user) {
      return resp.status(400).json({
        message: "Wrong credentials",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return resp.status(400).json({
        message: "Wrong credentials",
      });
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, process.env.SECRET);

    resp.status(200).json({
      message: "Login success",
      token,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      message: "Internal server error",
      error,
    });
  }
});

userRoutes.get("/favorites", authMiddleware, async (req, resp) => {
  try {
    const { user } = req;

    const books = await userModel.findById(user).select("favorites");

    resp.status(200).json({
      message: "favorites fetched successfully",
      books,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      message: "Internal server error",
      error,
    });
  }
});

userRoutes.put("/favorites/:id", authMiddleware, async (req, resp) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const _user = await userModel.findById(user);

    _user.favorites.push(id);

    await _user.save();

    resp.status(200).json({
      message: "added to favorite",
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      message: "Internal server error",
      error,
    });
  }
});
module.exports = userRoutes;
