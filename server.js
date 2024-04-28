const express = require("express");
const connectMongoose = require("./config/db");
const userRoutes = require("./routes/user.routes");
const bookRoutes = require("./routes/book.routes");
const reviewRoutes = require("./routes/review.routes");
require("dotenv").config();
const port = process.env.PORT || 8080;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRoutes);
app.use("/book", bookRoutes);
app.use("/review", reviewRoutes);

app.listen(port, () => {
  console.log("server listning on port", port);
  connectMongoose();
});
