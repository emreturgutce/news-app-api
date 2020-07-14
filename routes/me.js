const router = require("express").Router(),
  User = require("../models/User"),
  multer = require("multer"),
  sharp = require("sharp");

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

router.delete("/", async (req, res) => {
  const { _id } = req.user;
  try {
    await User.deleteOne({ _id });
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "User could not deleted" });
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/))
      return cb(new Error("File must be image"));
    cb(undefined, true);
  },
});

router.post("/avatar", upload.single("avatar"), async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await User.findById(_id);
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    user.avatar = buffer;
    await user.save();
    res.status(200).json({ success: true, message: "Avatar image added" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Avatar image could not added" });
  }
});

router.get("/avatar", async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await User.findById(_id);
    if (!user.avatar) throw new Error("Does not have avatar image");
    const image = user.avatar;
    res.status(200).json({
      success: true,
      message: "Avatar image fetched",
      data: { image },
    });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Avatar image could not fetched" });
  }
});

router.delete("/avatar", async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await User.findById(_id);
    if (!user.avatar) throw new Error("Does not have avatar image");
    user.avatar = undefined;
    await user.save();
    res.status(200).json({ success: true, message: "Avatar image deleted" });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Avatar image could not deleted" });
  }
});

router.get("/logout", async (req, res) => {
  const { _id } = req.user;
  try {
    await User.updateOne({ _id }, { tokens: [] });
    res.status(200).json({ success: true, message: "Logged out" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Could not logged out" });
  }
});

module.exports = router;
