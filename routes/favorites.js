const router = require("express").Router(),
  Favorites = require("../models/Favorites"),
  axios = require("axios");

router.get("/currency", async (req, res) => {
  const { favoritesId } = req.user;
  try {
    const favorites = await Favorites.findById(favoritesId);
    if (!favorites.currency)
      throw new Error("Currency news is not activated could not fetch");
    const response = await axios.get(process.env.CURRENCY_API_URL);
    res.status(200).json({
      success: true,
      message: "Latest currency news fetched",
      data: response.data,
    });
  } catch (err) {
    if (err.message === "Currency news is not activated could not fetch")
      return res.status(400).json({ success: false, message: err.message });
    res
      .status(500)
      .json({ success: false, message: "Could not fetch currency news" });
  }
});

router.get("/news", async (req, res) => {
  const { favoritesId } = req.user;
  try {
    const favorites = await Favorites.findById(favoritesId);
    if (!favorites.news)
      throw new Error("Latest news is not activated could not fetch");
    const response = await axios.get(process.env.NEWS_API_URL);
    res.status(200).json({
      success: true,
      message: "Latest currency news fetched",
      data: response.data,
    });
  } catch (err) {
    if (err.message === "Latest news is not activated could not fetch")
      return res.status(400).json({ success: false, message: err.message });
    res
      .status(500)
      .json({ success: false, message: "Could not fetch currency news" });
  }
});

router.get("/currency/activate", async (req, res) => {
  const { favoritesId } = req.user;
  try {
    const favorites = await Favorites.findById(favoritesId);
    if (favorites.currency) throw new Error("Already activated");
    favorites.currency = true;
    await favorites.save();
    res
      .status(200)
      .json({ success: true, message: "Latest currency news activated" });
  } catch (err) {
    if (err.message === "Already activated")
      return res.status(304).json({ success: false, message: err.message });
    res.status(500).json({
      success: false,
      message: "Latest currency news could not activated",
    });
  }
});

router.get("/news/activate", async (req, res) => {
  const { favoritesId } = req.user;
  try {
    const favorites = await Favorites.findById(favoritesId);
    if (favorites.news) throw new Error("Already activated");
    favorites.news = true;
    await favorites.save();
    res.status(200).json({ success: true, message: "Latest news activated" });
  } catch (err) {
    if (err.message === "Already activated")
      return res.status(304).json({ success: false, message: err.message });
    res.status(500).json({
      success: false,
      message: "Latest news could not activated",
    });
  }
});

router.get("/currency/deactivate", async (req, res) => {
  const { favoritesId } = req.user;
  try {
    const favorites = await Favorites.findById(favoritesId);
    if (!favorites.currency) throw new Error("Already deactivated");
    favorites.currency = false;
    await favorites.save();
    res
      .status(200)
      .json({ success: true, message: "Latest currency news deactivated" });
  } catch (err) {
    if (err.message === "Already deactivated")
      return res.status(304).json({ success: false, message: err.message });
    res.status(500).json({
      success: false,
      message: "Latest currency news could not deactivated",
    });
  }
});

router.get("/news/deactivate", async (req, res) => {
  const { favoritesId } = req.user;
  try {
    const favorites = await Favorites.findById(favoritesId);
    if (!favorites.news) throw new Error("Already deactivated");
    favorites.news = false;
    await favorites.save();
    res.status(200).json({ success: true, message: "Latest news deactivated" });
  } catch (err) {
    if (err.message === "Already deactivated")
      return res.status(304).json({ success: false, message: err.message });
    res.status(500).json({
      success: false,
      message: "Latest news could not deactivated",
    });
  }
});

module.exports = router;
