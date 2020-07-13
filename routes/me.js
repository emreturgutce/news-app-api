const router = require("express").Router(),
  User = require("../models/User");

router.get("/", (req, res) => {
  res.json({ success: true, message: "User fetched", data: req.user });
});

router.put("/", async (req, res) => {
  const { _id } = req.user;
  const { username, email, password } = req.body;
  try {
    if (!username && !email && !password) throw new Error("Not modified");
    const user = await User.findById(_id);
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;
    await user.save();
    res.status(200).json({ success: true, message: "User updated" });
  } catch (err) {
    console.log(err);
    res
      .status(304)
      .json({ success: false, message: "User could not modified" });
  }
});

router.get("/logout", async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await User.findById(_id);
    user.tokens = undefined;
    await user.save();
    res.status(200).json({ success: true, message: "Logged out" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Could not logged out" });
  }
});

module.exports = router;
