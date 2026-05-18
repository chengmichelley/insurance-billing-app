require("dotenv").config();
require("./db/connection");
const mongoose = require("mongoose");
const Patient = require("./models/patient");
const Insurance = require("./models/insurance");
const User = require("./models/user");
const bcrypt = require("bcryptjs");

const patientsMock = [
  {
    firstName: "John",
    lastName: "Doe",
    dob: "05/14/1984",
    isInactivated: false,
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    dob: "11/23/1991",
    isInactivated: false,
  },
  {
    firstName: "Robert",
    lastName: "Johnson",
    dob: "08/03/1965",
    isInactivated: false,
  },
  {
    firstName: "Maria",
    lastName: "Garcia",
    dob: "02/19/1978",
    isInactivated: false,
  },
  {
    firstName: "William",
    lastName: "Davis",
    dob: "12/05/2001",
    isInactivated: true,
  },
];

const insuranceTemplates = [
  {
    providerName: "CVS Caremark",
    bin: "004336",
    pcn: "ADV",
    group: "RX2026",
    coverageType: "commercial",
    relationship: "self",
    priority: 0,
  },
  {
    providerName: "Express Scripts",
    bin: "003858",
    pcn: "A4",
    group: "ESI2025",
    coverageType: "commercial",
    relationship: "dependent",
    priority: 10,
  },
  {
    providerName: "Medicare Part D",
    bin: "610502",
    pcn: "MEDDADV",
    group: "MCD2026",
    coverageType: "medicare",
    relationship: "self",
    priority: 0,
  },
  {
    providerName: "State Medicaid",
    bin: "610014",
    pcn: "MCAID",
    group: "STATEFL",
    coverageType: "medicaid",
    relationship: "self",
    priority: 0,
  },
  {
    providerName: "GoodRx Discount",
    bin: "015995",
    pcn: "GDRX",
    group: "GRX99",
    coverageType: "coupon",
    relationship: "self",
    priority: 5,
  },
];

const seedDatabase = async () => {
  try {
    console.log("🔄 Starting database initialization wipe...");
    await Patient.deleteMany({});
    await Insurance.deleteMany({});
    await User.deleteMany({});
    console.log("✅ Collections cleared cleanly.");

    console.log("👤 Creating user authentication profiles...");
    const adminPassword = await bcrypt.hash("password123", 10);
    const staffPassword = await bcrypt.hash("password123", 10);

    await User.create({
      username: "admin_demo",
      hashedPassword: password123,
      role: "admin",
      });

    await User.create({
      username: "staff_demo",
      hashedPassword: password123,
      role: "staff",
      });
        
    console.log(
      "🔑 Generated admin_demo (Admin) and staff_demo (Staff) with password123.",
    );

    console.log("🧬 Generating mock patients...");
    const createdPatients = await Patient.create(patientsMock);
    console.log(
      `✅ Successfully stored ${createdPatients.length} patient profiles.`,
    );

    console.log("💳 Compiling coordinated insurance tracks...");
    let insuranceCount = 0;

    for (const patient of createdPatients) {
      if (patient.isInactivated) continue;

      const policyCount = Math.floor(Math.random() * 3) + 1;
      const templatesShuffled = [...insuranceTemplates].sort(
        () => 0.5 - Math.random(),
      );

      for (let i = 0; i < policyCount; i++) {
        const template = templatesShuffled[i];

        const randomIdDigits = Math.floor(
          10000000 + Math.random() * 90000000,
        ).toString();

        await Insurance.create({
          ...template,
          memberId: "PB" + randomIdDigits,
          patient: patient._id,
        });
        insuranceCount++;
      }
    }

    console.log(
      `✅ Successfully stored ${insuranceCount} billing insurance coverages.`,
    );
    console.log("🚀 Database seeding operation completed flawlessly!");
    process.exit(0);
  } catch (error) {
    console.error(
      "❌ Critical fault caught running initialization script:",
      error.message,
    );
    process.exit(1);
  }
};

mongoose.connection.on("connected", () => {
  seedDatabase();
});
