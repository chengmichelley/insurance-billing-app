const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/user");
const authRequired = require("../middleware/authRequired");
const isAdmin = require("../middleware/isAdmin");

router.use(authRequired);

router.get("/profile", async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    res.render("users/profile.ejs", {
      user,
      err: null,
      message: req.query.message || null,
    });
  } catch (error) {
    res.status(400).render("error.ejs", { err: error.message });
  }
});

router.put("/profile/password", async (req, res) => {
  try {
    const { currentPassword, password, confirmPassword } = req.body;

    const user = await User.findById(req.session.user._id).select(
      "+hashedPassword",
    );

    const isMatch = await bcrypt.compare(currentPassword, user.hashedPassword);
    if (!isMatch) {
      throw new Error(
        "The current security password you entered is incorrect.",
      );
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters.");
    }
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(req.session.user._id, { hashedPassword });

    res.redirect("/user/profile?message=Password updated successfully!");
  } catch (error) {
    const user = await User.findById(req.session.user._id);
    res.status(400).render("users/profile.ejs", {
      user,
      err: error.message,
      message: null,
    });
  }
});

router.use(isAdmin);

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    let deleteTarget = null;

    if (req.query.confirmDelete) {
      deleteTarget = await User.findById(req.query.confirmDelete);
    }

    res.render("users/index", {
      users,
      deleteTarget,
    });
  } catch (error) {
    res.status(400).render("error.ejs", { err: error.message });
  }
});

router.put("/:id/role", async (req, res) => {
  try {
    if (req.params.id === req.session.user._id.toString()) {
      throw new Error("Cannot change your own role.");
    }

    await User.findByIdAndUpdate(req.params.id, { role: req.body.role });
    res.redirect("/user");
  } catch (error) {
    res.status(400).render("error.ejs", { err: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (req.params.id === req.session.user._id.toString()) {
      throw new Error("You cannot delete your own account.");
    }

    await User.findByIdAndDelete(req.params.id);
    res.redirect("/user");
  } catch (error) {
    res.status(400).render("error.ejs", { err: error.message });
  }
});

module.exports = router;
