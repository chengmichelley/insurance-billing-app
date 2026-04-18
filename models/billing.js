const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema({
  providerName: {type: String, required: false},
  bin: {type: String, required: true},
  pcn: {type: String, required: true},
  group: {type: String, required: true},
  memberId: {type: String, required: true},

  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  }
  
}, {timestamps: true})

module.exports = mongoose.model('Billing', billingSchema)