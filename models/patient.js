const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  firstName: {type: String, required: true, trim: true},
  lastName: {type: String, required: true, trim: true, index: true},
  dob: {type: String, required: true, index: true},
  isInactivated: {type: Boolean, default: false}  
}, { timestamps: true });

module.exports = mongoose.model( 'Patient', patientSchema)