const express = require("express");
const router = express.Router({ mergeParams: true });
const Insurance = require("../models/insurance");
const Patient = require("../models/patient");
const patientSelected = require("../middleware/patientSelected");
const { recommend } = require("../logic/recommendation");
const authRequired = require("../middleware/authRequired");

router.use(authRequired);

// =======================
// INDEX
// =======================
router.get("/", async (req, res) => {
  try {
    const activePatient = await Patient.findById(req.params.id);
    if (!activePatient) throw new Error("Patient not Found!");

    const rankedInsurance = await recommend(req.params.id);

    res.render("billings/index.ejs", {
      insurance: rankedInsurance,
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
    const activePatient = await Patient.findById(req.params.id);
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
    const bData = { ...req.body, patient: req.params.id };
    await Insurance.create(bData);
    res.redirect(`/patients/${req.params.id}/billing`);
  } catch (error) {
    res.status(400).render("error.ejs", { err: error.message });
  }
});

// =======================
// RECOMMENDATION
// =======================
router.get("/recommendation", async (req, res) => {
  try {
    const activePatient = await Patient.findById(req.params.id);
    if (!activePatient) throw new Error("Patient not found!");

    const results = await recommend(req.params.id);
    res.render("billings/recommendation.ejs", { results, activePatient });
  } catch (error) {
    res.status(400).render("error.ejs", { err: error.message });
  }
});

// =======================
// EDIT
// =======================
router.get("/:insuranceId/edit", async (req, res) => {
  try {
    const insurance = await Insurance.findById(req.params.insuranceId);
    if (!insurance) throw new Error("Insurance plan not found.");

    const activePatient = await Patient.findById(req.params.id);
    if (!activePatient) throw new Error("Patient not found.");

    res.render("billings/edit.ejs", { insurance, activePatient });
  } catch (error) {
    res.status(400).render("error.ejs", { err: error.message });
  }
});

// =======================
// UPDATE
// =======================
router.put("/:insuranceId", async (req, res) => {
  try {
    req.body.isInactivated = !!req.body.isInactivated;
    await Insurance.findByIdAndUpdate(req.params.insuranceId, req.body, {
      new: true,
    });
    res.redirect(
      `/patients/${req.params.id}/billing/${req.params.insuranceId}`,
    );
  } catch (error) {
    res.status(400).render("error.ejs", { err: error.message });
  }
});

// =======================
// SOFT DELETE (INACTIVATE)
// =======================
router.put("/:insuranceId/inactivate", async (req, res) => {
  try {
    const insurance = await Insurance.findById(req.params.insuranceId);
    if (!insurance) throw new Error("Insurance plan not found.");

    insurance.isInactivated = !insurance.isInactivated;
    await insurance.save();
    res.redirect(
      `/patients/${req.params.id}/billing/${req.params.insuranceId}`,
    );
  } catch (error) {
    res.status(400).render("error.ejs", { err: error.message });
  }
});

// =======================
// CONFIRM DELETE
// =======================
router.get("/:insuranceId/confirm_delete", async (req, res) => {
  try {
    const insurance = await Insurance.findById(req.params.insuranceId);
    if (!insurance) throw new Error("Insurance plan not found.");

    res.render("billings/billing_delete_confirm_cancel.ejs", { insurance });
  } catch (error) {
    res.status(400).render("error.ejs", { err: error.message });
  }
});

// =======================
// SHOW
// =======================
router.get("/:insuranceId", async (req, res) => {
  try {
    const insurance = await Insurance.findById(req.params.insuranceId);
    if (!insurance) throw new Error("Insurance plan not found.");

    const activePatient = await Patient.findById(req.params.id);
    if (!activePatient) throw new Error("Patient not found.");

    res.render("billings/show.ejs", {
      insurance,
      activePatient,
    });
  } catch (error) {
    res.status(400).render("error.ejs", { err: error.message });
  }
});

// =======================
// DELETE
// =======================
router.delete("/:insuranceId", async (req, res) => {
  try {
    await Insurance.findByIdAndDelete(req.params.insuranceId);
    res.redirect(`/patients/${req.params.id}/billing`);
  } catch (error) {
    res.status(400).render("error.ejs", { err: error.message });
  }
});

module.exports = router;
