const express = require("express");
const router = express.Router();
const Billing = require("../models/billing");

// =======================
// INDEX
// =======================
router.get("/", async (req, res) => {
  try {
    const billing = await Billing.find({});
    res.render("billing/index.ejs", { billing });
  } catch (error) {
    res.status(400).render("error.ejs", { err: error.message });
  }
});

// =======================
// NEW
// =======================
router.get("/new", (req, res) => {
  res.render("billing/new.ejs");
});

// =======================
// CREATE
// =======================
router.post("/", async (req, res) => {
  try {
    await Billing.create(req.body);
    res.redirect("/billing");
  } catch (error) {
    res.status(400).render("error.ejs", { err: error.message });
  }
});

// =======================
// EDIT
// =======================
router.get("/:id/edit", async (req, res) => {
  try {
    const billing = await Billing.findById(req.params.id);

    if (!billing) throw new Error("Billing not found");

    res.render("billing/edit.ejs", { billing });
  } catch (error) {
    res.render("error.ejs", { err: error.message });
  }
});

// =======================
// UPDATE
// =======================
router.put("/:id", async (req, res) => {
  try {
    await Billing.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/billing/${req.params.id}`);
  } catch (error) {
    res.render("error.ejs", { err: error.message });
  }
});

// =======================
// DELETE
// =======================
router.delete("/:id", async (req, res) => {
  try {
    await Billing.findByIdAndDelete(req.params.id);
    res.redirect("/billing");
  } catch (error) {
    res.render("error.ejs", { err: error.message });
  }
});

// =======================
// SOFT DELETE (INACTIVATE)
// =======================
router.put("/:id/inactivate", async (req, res) => {
  try {
    await Billing.findByIdAndUpdate(req.params.id, {
      isInactivated: true,
    });
    res.redirect("/billing");
  } catch (error) {
    res.render("error.ejs", { err: error.message });
  }
});

// =======================
// CONFIRM DELETE
// =======================
router.get("/:id/confirm_delete", async (req, res) => {
  try {
    const billing = await Billing.findById(req.params.id);

    if (!billing) throw new Error("Billing not found");

    res.render("billing/billing_delete_confirm_cancel.ejs", { billing });
  } catch (error) {
    res.render("error.ejs", { err: error.message });
  }
});

// =======================
// SHOW
// =======================
router.get("/:id", async (req, res) => {
  try {
    const billing = await Billing.findById(req.params.id);

    if (!billing) throw new Error("Billing not found");

    res.render("billing/show.ejs", { billing });
  } catch (error) {
    res.render("error.ejs", { err: error.message });
  }
});

module.exports = router;
