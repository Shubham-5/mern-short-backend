const mongoose = require("mongoose");
require("dotenv").config();

function connectdb() {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
    })
    .then(() => console.log("db connected "))
    .catch((err) => console.log(err));
}

module.exports = connectdb;
