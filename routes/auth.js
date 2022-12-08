const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const user = new User({
      email: email,
      password: hashedPass,
    });
    const savedUser = await user.save();
    res.status(201).send({
      message: "user created successfully",
      user: { email: savedUser.email, id: savedUser._id },
    });
  } catch (error) {
    res.status(500).send({ error });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const userExist = await User.findOne({ email: email });

  if (!userExist) {
    return res.status(400).json({ message: "Email not registered" });
  }
  const pass = await bcrypt.compare(password, userExist.password);
  if (!pass) return res.status(400).send({ message: "Incorrect password" });
  res.send({
    message: "login success",
    user: { email: userExist.email, id: userExist._id },
  });
});

module.exports = router;
