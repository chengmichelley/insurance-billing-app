const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  dob: {type: String, required: true},  
}, { timestamps: true });

module.exports = mongoose.model( 'Patient', patientSchema)