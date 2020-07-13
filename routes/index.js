const router = require("express").Router(),
  passport = require("../config/passport");

router.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  (req, res) => {
    res
      .status(201)
      .json({ success: true, message: "User created", data: [req.user] });
  }
);

router.post(
  "/login",
  passport.authenticate("login", { session: false }),
  async (req, res, next) => {
    res.status(200).json({
      success: true,
      message: "Logged in",
      data: { user: req.user },
    });
  }
);

module.exports = router;
