const mongoose = require("mongoose");

const favoritesSchema = new mongoose.Schema({
  currency: {
    type: Boolean,
    default: false,
  },
  news: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Favorites", favoritesSchema);
