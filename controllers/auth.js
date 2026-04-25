const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const authRequired = require("../middleware/authRequired");
const isAdmin = require("../middleware/isAdmin");

router.get("/sign-up", authRequired, isAdmin, (req, res) => {
  res.render("auth/sign-up.ejs", { err: "" });
});

router.post("/sign-up", authRequired, isAdmin, async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;

    const foundUser = await User.findOne({ username: username.toLowerCase() });
    if (foundUser) {
      throw new Error(`User with the username "${username}" already exists.`);
    }

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      hashedPassword,
      role: "user",
    });

    res.redirect(
      `/user?message=Staff member ${username} created successfully!`,
    );
  } catch (error) {
    res.render("auth/sign-up", { err: error.message });
  }
});

router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in", { err: "" });
});

router.post("/sign-in", async (req, res) => {
  const { username, password } = req.body;
  try {
    const foundUser = await User.findOne({
      username: username.toLowerCase(),
    }).select("+hashedPassword");

    if (!foundUser) {
      throw new Error("Invalid Username or Password.");
    }

    const isValidPassword = await bcrypt.compare(
      password,
      foundUser.hashedPassword,
    );
    if (!isValidPassword) {
      throw new Error("Invalid Username or Password.");
    }

    req.session.user = {
      _id: foundUser._id,
      username: foundUser.username,
      role: foundUser.role,
    };

    req.session.save(() => {
      const redirectTo = req.session.returnTo || "/";
      delete req.session.returnTo;
      res.redirect(redirectTo);
    });
  } catch (error) {
    res.render("auth/sign-in", { err: error.message });
  }
});

router.get("/sign-out", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/sign-in");
  });
});

module.exports = router;
