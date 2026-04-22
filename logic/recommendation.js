const Billing = require('../models/billing');

const calculateScore = (insurance, medType) => {
  let score = insurance.priority || 0;

  if(insurance.coverageType === 'medicaid') {
    score += 10;
  }

  if(medType === 'brand') {
    score += 5;
  }

  if(insurance.coverageType === 'secondary') {
    score += 3;
  }

  return score;
};

const generateNote = (insurance, medType) => {
  if(insurance.coverageType === 'medicaid' && medType === 'brand') {
    return 'PA likely required'
  }

  if(insurance.coverageType === 'primary') {
    return 'Try first'
  }

  if(insurance.coverageType === 'secondary') {
    return 'Try next if primary is rejected'
  }

  return 'Standard Billing'
};

const recommend = async (billingId, medType) => {
  const currentBilling= await Billing.findById(billingId);
  if(!currentBilling) 
    return [];

  const allInsurances = await Billing.find({
    patient: currentBilling.patient,
    isInactivated: { $ne: true }
  });

  const ranked = allInsurances.map(ins =>({
    insurance: ins,
    score: calculateScore(ins, medType),
    note: generateNote(ins, medType)
  }));

  ranked.sort((a, b)=> b.score - a.score);

  return ranked;
};

module.exports = { recommend };