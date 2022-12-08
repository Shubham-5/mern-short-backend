const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dbconnect = require("./dbconnect");
const authRoute = require("./routes/auth");
const shortUrl = require("./routes/shortUrl");
require("dotenv").config();

const app = express();

dbconnect();
// To parse URL encoded data
app.use(bodyParser.urlencoded({ extended: false }));

// To parse json data
app.use(bodyParser.json());
app.use(cors());

app.use("/api", authRoute);
app.use("/", shortUrl);

app.listen(process.env.PORT || 6000, () => console.log("up and running"));
