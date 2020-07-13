const express = require("express");
require("dotenv").config();
require("colors");
require("./config/database");
const passport = require("./config/passport");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("morgan")("dev"));
app.use(require("helmet")());
app.use(require("cors")());

app.use("/", require("./routes"));
app.use(
  "/home",
  passport.authenticate("jwt", { session: false }),
  require("./routes/home")
);
app.use(require("./middleware/notFound"));
app.use(require("./middleware/errorHandler"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`App is running on port ${PORT}`.white.bold)
);
