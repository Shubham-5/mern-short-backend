const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const auth = require("../middlewares/auth");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const user = new User({
      email: email,
      password: hashedPass,
      displayName: name,
    });
    const savedUser = await user.save();
    const token = jwt.sign({ id: savedUser._id }, process.env.SECRET);
    res.status(201).send({
      message: "user created successfully",
      token,
      user: {
        email: savedUser.email,
        id: savedUser._id,
        displayName: savedUser.displayName,
      },
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

  const token = jwt.sign({ id: userExist._id }, process.env.SECRET);

  res.send({
    message: "login success",
    token,
    user: {
      email: userExist.email,
      id: userExist._id,
      displayName: userExist.displayName,
    },
  });
});

router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);
    const verified = jwt.verify(token, process.env.SECRET);
    if (!verified) return res.json(false);
    const user = await User.findById(verified.id);
    if (!user) return res.json(false);
    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({
    displayName: user.displayName,
    id: user._id,
    email: user.email,
  });
});
module.exports = router;
