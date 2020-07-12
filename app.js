const express = require("express");
require("dotenv").config();
require("colors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("morgan")("dev"));
app.use(require("helmet")());
app.use(require("cors")());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`App is running on port ${PORT}`.white.bold)
);
