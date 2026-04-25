const express = require("express");
const router = express.Router({ mergeParams: true });
const Billing = require("../models/billing");
const Patient = require("../models/patient");
const patientSelected = require("../middleware/patientSelected");
const { recommend } = require("../logic/recommendation");
const authRequired = require("../middleware/authRequired");

// =======================
// INDEX
// =======================
router.get("/", async (req, res) => {
  try {
    const activePatient = await Patient.findById(req.params.patientId);
    if (!activePatient) throw new Error("Patient not Found!");

    const rankedBilling = await recommend(req.params.patientId);

    res.render("billings/index.ejs", {
      billing: rankedBilling,
      activePatient,
    });
  } catch (error) {
    res.status(400).render("error.ejs", { err: error.message });
  }
});

// =======================
// NEW
// =======================
router.get("/new", patientSelected, async (req, res) => {
  try {
    const activePatient = await Patient.findById(req.params.patientId);
    if (!activePatient) throw new Error("Patient not found. Please try again!");

    res.render("billings/new.ejs", { activePatient });
  } catch (error) {
    res.status(400).render("error.ejs", { err: error.message });
  }
});

// =======================
// CREATE
// =======================
router.post("/", async (req, res) => {
  try {
    req.body.isInactivated = !!req.body.isInactivated;
    const bData = { ...req.body, patient: req.params.patientId };
    await Billing.create(bData);
    res.redirect(`/patients/${req.params.patientId}/billing`);
  } catch (error) {
    res.status(400).render("error.ejs", { err: error.message });
  }
});

// =======================
// RECOMMENDATION
// =======================
router.get("/recommendation", async (req, res) => {
  try {
    const results = await recommend(req.params.patientId);
    res.render("billings/recommendation.ejs", { results });
  } catch (error) {
    res.render("error.ejs", { err: error.message });
  }
});

// =======================
// EDIT
// =======================
router.get("/:id/edit", async (req, res) => {
  try {
    const billing = await Billing.findById(req.params.id);
    if (!billing) throw new Error("Billing not found");

    const activePatient = await Patient.findById(req.params.patientId);
    if (!activePatient) throw new Error("Patient not found");

    res.render("billings/edit.ejs", { billing, activePatient });
  } catch (error) {
    res.render("error.ejs", { err: error.message });
  }
});

// =======================
// UPDATE
// =======================
router.put("/:id", async (req, res) => {
  try {
    req.body.isInactivated = !!req.body.isInactivated;
    await Billing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.redirect(`/patients/${req.params.patientId}/billing/${req.params.id}`);
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
    res.redirect(`/patients/${req.params.patientId}/billing`);
  } catch (error) {
    res.render("error.ejs", { err: error.message });
  }
});

// =======================
// SOFT DELETE (INACTIVATE)
// =======================
router.put("/:id/inactivate", async (req, res) => {
  try {
    const billing = await Billing.findById(req.params.id);
    billing.isInactivated = !billing.isInactivated;
    await billing.save();
    res.redirect(`/patients/${req.params.patientId}/billing`);
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

    res.render("billings/billing_delete_confirm_cancel.ejs", { billing });
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

    const activePatient = await Patient.findById(req.params.patientId);
    if (!activePatient) throw new Error("Patient not found");

    res.render("billings/show.ejs", { billing, activePatient });
  } catch (error) {
    res.render("error.ejs", { err: error.message });
  }
});

module.exports = router;
