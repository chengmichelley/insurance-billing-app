const express = require("express");
const router = express.Router();
const Patient = require("../models/patient");
const authRequired = require("../middleware/authRequired");
const { recommend } = require("../logic/recommendation");

router.use(authRequired);

// =======================
// SEARCH
// =======================
router.get("/search", async (req, res) => {
  try {
    const { firstName, lastName, dob } = req.query;
    let results = [];

    const hasSearchTerms = Object.keys(req.query).length > 0;

    if (hasSearchTerms) {
      const hasBothNames = firstName && lastName;
      const hasDob = !!dob;

      if (!hasBothNames && !dob) {
        throw new Error(
          "Please provide both First & Last name, or a Date of Birth.",
        );
      }

      const query = {};
      if (firstName) query.firstName = new RegExp(firstName, "i");
      if (lastName) query.lastName = new RegExp(lastName, "i");
      if (dob) query.dob = dob;

      results = await Patient.find(query);
    }

    res.render("patients/search.ejs", {
      results,
      firstName: firstName || "",
      lastName: lastName || "",
      dob: dob || "",
      message: req.query.message || null,
      err: req.query.error || null,
    });
  } catch (error) {
    res.status(400).render("patients/search.ejs", {
      results: [],
      err: error.message,
      firstName: "",
      lastName: "",
      dob: "",
    });
  }
});

// =======================
// NEW
// =======================
router.get("/new", async (req, res) => {
  res.render("patients/new.ejs");
});

// =======================
// CREATE
// =======================
router.post("/", async (req, res) => {
  try {
    const newPatient = await Patient.create(req.body);
    res.redirect(`/patients/${newPatient._id}`);
  } catch (error) {
    res.status(400).render("error.ejs", { err: error.message });
  }
});

// =======================
// SELECT
// =======================
router.get("/select/:id", async (req, res) => {
  try {
    req.session.selectedPatientId = req.params.id;
    res.redirect(`/patients/${req.params.id}/billing/new`);
  } catch (error) {
    res.status(400).render("error.ejs", { err: error.message });
  }
});

// =======================
// CLEAR SELECTION
// =======================
router.get("/clear-selection", async (req, res) => {
  try {
    req.session.selectedPatientId = null;
    res.redirect(`/patients/search`);
  } catch (error) {
    res.status(400).render("error.ejs", { err: error.message });
  }
});

// =======================
// EDIT
// =======================
router.get("/:id/edit", async (req, res) => {
  try {
    const foundPatient = await Patient.findById(req.params.id);
    if (!foundPatient) throw new Error("Patient not found");
    res.render("patients/edit.ejs", { patient: foundPatient });
  } catch (error) {
    res.render("error.ejs", { err: error.message });
  }
});

// =======================
// UPDATE
// =======================
router.put("/:id", async (req, res) => {
  try {
    req.body.isInactivated = req.body.isInactivated === "true";
    await Patient.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/patients/${req.params.id}`);
  } catch (error) {
    res.render("error.ejs", { err: error.message });
  }
});

// =======================
// SOFT DELETE (INACTIVATE)
// =======================
router.put("/:id/inactivate", async (req, res) => {
  try {
    await Patient.findByIdAndUpdate(req.params.id, { isInactivated: true });
    res.redirect(`/patients/${req.params.id}`);
  } catch (error) {
    res.render("error.ejs", { err: error.message });
  }
});

// =======================
// SHOW
// =======================
// =======================
// SHOW
// =======================
router.get("/:id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) throw new Error("Patient not found");

    req.session.selectedPatientId = patient._id; 

    const ranked = await recommend(patient._id);
    const primaryInsurance = ranked.length > 0 ? ranked[0] : null;

    res.render("patients/show.ejs", {
      patient,
      primaryInsurance,
    });
  } catch (error) {
    res.render("error.ejs", { err: error.message });
  }
});

module.exports = router;
