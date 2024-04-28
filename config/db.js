const mongoose = require("mongoose");

function connectMongoose() {
  const url = process.env.MONGO_URL;
  mongoose
    .connect(url, {
      dbName:"evaluation-1",
    })
    .then(() => {
      console.log("mongoose connected");
    })
    .catch((e) => {
      console.log("mongoose connection failed", e);
      process.exit(1);
    });
}

module.exports = connectMongoose;
