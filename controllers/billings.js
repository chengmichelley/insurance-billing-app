const express = require('express');
const router = express.Router({ mergeParams: true });
const Billing = require('../models/billing');
const Patient = require('../models/patient');
const patientSelected = require('../middleware/patientSelected');
const { recommend } = require('../logic/recommendation');
const authRequired = require('../middleware/authRequired');

// =======================
// INDEX
// =======================
router.get("/", async (req, res) => {
  try {
    const billing = await Billing.find({ patient: req.params.patientId });
    res.render("billing/index.ejs", { billing, patientId: req.params.patientId });
  } catch (error) {
    res.status(400).render("error.ejs", { err: error.message });
  }
});

// =======================
// NEW
// =======================
router.get("/new", async (req, res) => {
  const patientId = req.params.patientId;
  const patient = await Patient.findById(patientId)
  if(!patient) {
      throw new Error(('Patient not found. Please try again!'));
  }
  res.render("billing/new.ejs", { patient });
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

router.get('/:id/recommendation', async (req, res)=> {
  try {
    const medType = req.query.medType || 'generic';
    if(!medType) {
            throw new Error('Med Type not found. Please try again!');
    }
    const results = await recommend(req.params.id, medType);
  
    res.render('billing/recommendation.ejs', {
      results,
      medType
    });
  } catch (error) {
    res.render('error.ejs', { err: error.message })
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
    await Billing.findByIdAndUpdate(req.params.id, {
      isInactivated: true,
    });
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
