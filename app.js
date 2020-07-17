const express = require("express");
require("dotenv").config();
require("colors");
require("./config/database");
const passport = require("./config/passport");

const app = express();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(require("cors")());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("morgan")("dev"));
app.use(require("helmet")());

app.use("/", require("./routes"));
app.use(
  "/me",
  passport.authenticate("jwt", { session: false }),
  require("./routes/me")
);
app.use(
  "/favorites",
  passport.authenticate("jwt", { session: false }),
  require("./routes/favorites")
);
app.use(require("./middleware/notFound"));
app.use(require("./middleware/errorHandler"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`App is running on port ${PORT}`.white.bold)
);
