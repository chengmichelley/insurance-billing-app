const Patient = require('../models/patient')

const viewData = async (req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.selectedPatientId = req.session.selectedPatientId || null;
  if(req.session.selectedPatientId) {
    try{
      const activePatient = await Patient.findById(req.session.selectedPatientId);
      res.locals.activePatient = activePatient || null;
    } catch (error) {
      res.locals.activePatient = null;
    }
  } else {
    res.locals.activePatient = null;
  };

  next();
};

module.exports = viewData;