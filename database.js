const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log(`Connected to MongoDB`.green.bold))
  .catch((err) =>
    console.log(`Error occurred connecting MongoDB: ${err}`.red.bold)
  );
