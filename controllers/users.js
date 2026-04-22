const express = require("express");
const router = express.Router();
const User = require("../models/user");
const authRequired = require("../middleware/authRequired");

router.get("/all", authRequired, async (req, res) => {
  try {
    const users = await User.find();
    res.render("users/index", { users: users, currentUser: req.session.user });
  } catch (error) {
    res.render("error.ejs", { err: error.message });
  }
});

module.exports = router;
