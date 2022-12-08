const mongoose = require("mongoose");
const user = require("./user");

const shortUrlSchema = new mongoose.Schema({
  urlId: {
    type: String,
    required: true,
  },
  full: {
    type: String,
    required: true,
  },
  short: {
    type: String,
    required: true,
    unique: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  userId: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: Date.now,
  },
});

const Url = mongoose.model("ShortUrl", shortUrlSchema);
module.exports = Url;
