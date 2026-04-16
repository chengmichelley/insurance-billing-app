const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  dob: {type: Date, required: true},  
})

const billingSchema = new mongoose.Schema({
  bin: {type: String, required: true},
  pcn: {type: String, required: true},
  group: {type: String, required: true},
  rxId: {type: String, required: true},
  patient: [patientSchema],
}, {timestamps: true})

module.exports = mongoose.model('Billing', billingSchema)