const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an Email!"],
    unique: [true, "Email Exist"],
  },
  password: {
    type: {},
    required: [true, "Please provide a password!"],
    unique: false,
  },
  displayName: { type: String },
});

const user = mongoose.model("Users", UserSchema);
module.exports = user;
