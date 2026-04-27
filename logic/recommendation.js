const Insurance = require("../models/insurance");

const calculateScore = (ins) => {
  let score = 0;

  const typeWeights = {
    commercial: 10,
    medicare: 20,
    medicaid: 30,
    coupon: 40,
  };

  score += typeWeights[ins.coverageType] || 50;

  if (ins.relationship === "self") {
    score -= 5;
  }

  score -= ins.priority || 0;

  return score;
};

const recommend = async (patientId) => {
  const allInsurances = await Insurance.find({
    patient: patientId,
    isInactivated: { $ne: true },
  });

  const ranked = allInsurances.map((ins) => ({
    insurance: ins,
    score: calculateScore(ins),
  }));

  // Lower score = higher billing priority
  ranked.sort((a, b) => a.score - b.score);

  let labelIndex = 0;
  return ranked.map((item) => {
    let label;
    if (item.insurance.coverageType === "coupon") {
      label = "Coupon";
    } else if (item.insurance.coverageType === "medicaid") {
      label = "Medicaid";
    } else {
      const labels = ["Primary", "Secondary", "Tertiary"];
      label = labels[labelIndex] || "Additional";
      labelIndex++;
    }

    return {
      ...item,
      label,
    };
  });
};

module.exports = { recommend };
