const selectedPatient = (req, res, next)=> {
  if(!req.session.selectedPatientId){
    return res.redirect('/patients/search?error=Please select a patient first!')
  }
  next();
};

module.exports = selectedPatient;