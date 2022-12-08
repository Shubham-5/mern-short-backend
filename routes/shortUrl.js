const express = require("express");
const Url = require("../models/shortUrl");
require("dotenv").config();
const router = express.Router();
const { nanoid } = require("nanoid");

router.post("/short", async (req, res) => {
  const { origUrl, id } = req.body;
  const base = process.env.BASE;
  const urlId = nanoid();
  try {
    let url = await Url.findOne({ full: origUrl, userId: id });
    if (url) {
      res.status(400).send({ message: "Url already shorted" });
    } else {
      const short = `${base}/${urlId}`;
      const createdUrl = new Url({
        full: origUrl,
        short: short,
        urlId,
        userId: id,
        date: new Date(),
      });
      const savedUrl = await createdUrl.save();
      res.status(201).send({ message: "short created successfully", savedUrl });
    }
  } catch (error) {
    res.status(500).send({ error });
  }
});
router.get("/:urlId", async (req, res) => {
  try {
    const url = await Url.findOne({ urlId: req.params.urlId });
    if (url) {
      url.clicks++;
      await url.save();
      return res.redirect(url.full);
    } else {
      res.status(404).json("Not Found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
});
router.get("/urls/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const userUrls = await Url.find({ userId: id });
    if (userUrls) {
      return res.send(userUrls);
    } else {
      return res.send({ message: "Shorted urls not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
});

module.exports = router;
