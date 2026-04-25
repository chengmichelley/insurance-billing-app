const express = require("express");
const bcrypt = require("bcryptjs")
const router = express.Router();
const User = require("../models/user");
const authRequired = require("../middleware/authRequired");
const isAdmin = require("../middleware/isAdmin");

router.use(authRequired);

// =======================
// PUBLIC STAFF ROUTES
// =======================

router.get('/profile', async (req, res)=>{
  try {
    const user = await User.findById(req.session.user._id);
    res.render("users/profile.ejs", { 
      user, 
      err: null,
      message: req.query.message || null
    });
  } catch (error) {
    res.render("error.ejs", { err: error.message });
  }
})

router.put("/profile/password", async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    if(password !== confirmPassword) {
      throw new Error('Passwords do not match!')
    };

    const hashedPassword = bcrypt.hashSync(password, 8);
    await User.findByIdAndUpdate(req.session.user._id, { hashedPassword })

    res.redirect("/user/profile?message=Password updated successfully!");
  } catch (error) {
    const user = await User.findById(req.session.user._id);
    res.render("users/profile.ejs", { user, err: error.message });
  }
});

// =======================
// ADMIN ONLY ROUTES
// =======================

router.use(isAdmin);

// =======================
// INDEX
// =======================
router.get("/", authRequired, isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.render("users/index", { users });
  } catch (error) {
    res.render("error.ejs", { err: error.message });
  }
});

// =======================
// UPDATE
// =======================
router.put("/:id/role", async (req, res) => {
  try {
    if(req.params.id === req.session.user._id) {
      throw new Error('Cannot change your own role.')
    }

    await User.findByIdAndUpdate(req.params.id, { role: req.body.role });
    res.redirect('/user');
  } catch (error) {
    res.render("error.ejs", { err: error.message });
  }
});

// =======================
// DELETE
// =======================
router.delete("/:id", async (req, res) => {
  try {
    if(req.params.id === req.session.user._id) {
      throw new Error('You cannot delete your own account.')
    }

    await User.findByIdAndDelete(req.params.id);
    res.redirect('/user');
  } catch (error) {
    res.render("error.ejs", { err: error.message });
  }
});

module.exports = router;
