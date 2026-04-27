# 💊 PHARMABILL
![PHARMABILL Logo](public/images/PharmabillLogo.png)

PHARMABILL is a full-stack pharmacy workflow application that automates the Coordination of Benefits (COB) process by intelligently ranking patient insurance plans.

> 💊 **Real-World Origin**
> Built from firsthand experience working at **CVS Pharmacy** — where insurance billing errors, trial-and-error claim submissions, and staff inefficiencies are daily realities.

> "Taking the guesswork out of pharmacy billing."

## 🚀 Live Application
**[View PHARMABILL on Render](https://pharmabill.onrender.com)**

### 🔑 Demo Credentials
Use these accounts to explore the different permission levels and workflows:


| Role | Username | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin_demo` | `password123` |
| **Staff Member** | `staff_demo` | `password123` |

---

## Background

### 🧠 The Problem

In retail pharmacy environments, the drop-off station is a critical bottleneck.

Pharmacy staff must quickly:

- Enter prescription data
- Identify the correct insurance plan
- Process claims with limited or inconsistent information

**Key Challenges**

- Multiple insurance plans may share the same BIN but differ in PCN or group number
- Insurance selection often relies on trial-and-error
- Incorrect billing leads to:
  - Claim rejections
  - Triage rework
  - Increased patient wait times

This creates operational inefficiencies and added pressure on pharmacy staff.

### 💡 The Solution

PHARMABILL introduces a rule-based recommendation engine that ranks insurance plans based on real-world billing logic.

Instead of guessing, staff receive:

- Clear Primary / Secondary / Tertiary recommendations
- Intelligent prioritization based on patient and plan data
- The ability to manually override decisions when needed

## ✨ Core Features

### 🚀 Insurance Recommendation Engine

Ranks plans using weighted factors:
- Relationship Status (Self vs Dependent)
- Coverage Type (Commercial, Medicare, Medicaid, Coupon)
- Manual Priority Boost
- Automatically assigns Primary, Secondary, Tertiary labels

### 👤 Patient-Centric Workflow

- Search or create patient profiles
- Manage multiple insurance plans per patient
- Persistent Active Patient Session across views

### 🛡️ Role-Based Access Control

- Admin: Manage staff accounts and permissions
- Staff: Manage patients and insurance plans

### 📦 Data Integrity Features

- Soft-delete (archiving) for insurance plans
- Structured schema for consistent data entry
- Designed to handle incomplete or ambiguous insurance data

---

## 🧠 How the Recommendation Engine Works

PHARMABILL uses a scoring system to simulate real-world COB decision-making.

Each insurance plan is assigned a score:

```javascript
score = relationshipWeight + coverageWeight + manualBoost
```
Plans are then sorted and labeled:

- Primary (highest score)
- Secondary
- Tertiary

This reduces the need for repeated manual billing attempts.

### 🔄 Example Workflow

1. Search or create a patient
2. Add multiple insurance plans
3. PHARMABILL ranks plans instantly
4. Select the top recommended plan
5. If claim fails → proceed to next ranked option

### 🏗️ System Flow

```
User (Technician)
        ↓
Frontend (EJS Views)
        ↓
Express Routes (Controller Logic)
        ↓
Recommendation Engine (Scoring Logic)
        ↓
MongoDB (Patient + Insurance Data)
        ↓
Ranked Insurance Plans → UI Display
```

## ⚠️ Challenges & Tradeoffs

### Real-World Ambiguity

Insurance data is often incomplete or inconsistent.

Approach:

- Flexible schema design
- Manual override capability

### Accuracy vs Complexity

A fully accurate COB system would require live payer integrations.

### Tradeoff:

- Implemented a rule-based approximation
- Focused on improving workflow efficiency rather than replacing adjudication systems

### State Management

Maintaining patient context across multiple views was essential.

### Solution:

- Session-based active patient tracking
- Persistent UI indicator

---

## 📈 Impact

PHARMABILL is designed to:

* ⏱️ Reduce time spent selecting insurance plans
* 🔁 Decrease claim reprocessing cycles
* 🧠 Support newer technicians with guided decision-making
* 😊 Improve patient wait time and overall experience

---

## 🛠️ How to Use

### 1. Find or Create a Patient
* Use the **Patient Search** card to find a profile by name or DOB.
* If no profile exists, click **Create New Patient** to start a fresh clinical record.

### 2. Manage Insurance Plans
* From the **Patient Profile**, click **Add New Plan**.
* Enter the 4 RX data numbers usually found on pharmacy benefit card (**BIN, PCN, Group, and Member ID**).
* Select the **Relationship** (Self/Dependent) and **Coverage Type**. These fields power the automated ranking logic!

### 3. View Recommendations
* Navigate to the **Insurance Plans** list.
* The system automatically applies the **COB logic** and labels plans as **Primary, Secondary, or Tertiary**.
* Click the **Active Patient** bubble in the navbar at any time to return to the clinical summary.

### 4. Admin Management (Admin Role Only)
* Access the **Staff Directory** to register new pharmacy staff and assign roles.
* Manage user accounts as personnel changes occur.

---

## 📸 Screenshots


| Dashboard View | Patient Search |
| :--- | :--- |
| ![Dashboard Screenshot](https://placeholder.com) | ![Search Screenshot](https://placeholder.com) |

| Insurance Ranking | Patient Profile |
| :--- | :--- |
| ![Ranking Screenshot](https://placeholder.com) | ![Profile Screenshot](https://placeholder.com) |

---

## 🔮 Future Improvements

* Adjudication Simulator
  * Simulate real claim responses (e.g., Prior Authorization, Refill Too Soon)
* Prescription Intake Module
  * Support script entry workflows
* Medication API Integration
  * Identify generic vs brand medications
* Audit Logging
  * Track billing decisions and retries

## 🛠️ Tech Stack

### Frontend

- EJS (server-rendered views)
- HTML5
- CSS3

### Backend

- Node.js
- Express.js
- Method-Override
- Dotenv

### Database

- MongoDB
- Mongoose ODM
- Connect-Mongo

### Authentication

- Session-based authentication
- Role-based authorization
- Bcrypt.js
- Express-Session 

---

## ⭐ Final Note

PHARMABILL demonstrates how software can transform high-pressure, experience-based workflows into structured, scalable systems—reducing cognitive load and improving operational efficiency.
