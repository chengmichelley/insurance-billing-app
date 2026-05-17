# 💊 PHARMABILL
![PHARMABILL Logo](public/images/PharmabillLogo.png)

PHARMABILL is a full-stack pharmacy workflow application that automates the Coordination of Benefits (COB) process by intelligently ranking patient insurance plans.

> 💊 **Real-World Origin**
> Built from firsthand experience working at **CVS Pharmacy** — where insurance billing errors, trial-and-error claim submissions, and staff inefficiencies are daily realities.

> "Taking the guesswork out of pharmacy billing."

---

## 🚀 Live Application
**[View PHARMABILL on Heroku](https://pharmabill-288e20e5dbf0.herokuapp.com/)**

---

## 💻 Local Development Setup & Testing

Follow these steps to seed, authenticate, and verify your local environment independently of the production Heroku instance.

### 🔐 Local Demo Credentials
Running the local initialization script populates two pre-configured staff profiles with varying permission layers to allow full testing of the authorization middleware:

| Role | Username | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin_demo` | `password123` | Full CRUD access, role management, staff deletion. |
| **Staff Member** | `staff_demo` | `password123` | Patient lookup, billing management, restricted from admin panels. |

### 🧪 Testing the Local Seed Dataset
After executing `node seed.js` against your local `.env` database connection string, open `http://localhost:3000` and verify system behavior using these test search queries:

* **Direct Profile Redirection**: Search for `John Doe`. The system will automatically skip the listings page and redirect straight to his individual patient hub.
* **Multi-Match Layout Grid**: Search for `Jane Smith` to test how the interface stacks and displays multiple records matching identical criteria.
* **Account Reactivation Feature**: Search for `William Davis` to view an inactive account and test the dynamic **✨ Activate** status toggle.

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

---

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

## 🧠 Billing Recommendation Logic Engine

PHARMABILL implements a custom weighted prioritization algorithm to automatically determine the correct billing hierarchy for patients with multiple concurrent insurance policies. This prevents Coordination of Benefits (COB) network rejection faults at the point of claim submission.

The prioritization process runs in three distinct sequential stages:

### 🧮 1. Weight Calculation Formula
The logic engine evaluates each active policy through three parameter checks to calculate a final penalty `score`:

$$\text{Final Score} = \text{Coverage Type Base Weight} - \text{Relationship Discount} - \text{Manual Boost Value}$$

#### A. Coverage Type Base Weights
Plans are assigned static baseline penalties. Lower values indicate higher billing priority:
* **Commercial** (Private / Employer): `10` points
* **Medicare** (Federal Elderly Care): `20` points
* **Medicaid** (State Assistance): `30` points
* **Discount Coupon / GoodRx**: `40` points
* *Fallback Catch-All*: `50` points

#### B. Subscriber Relationship Deductions
Per standard COB coordination rules, a policy held directly by the patient outranks one where they are covered as a dependent.
* If `relationship === 'self'`, the engine applies a **`-5` point discount** to lower the penalty score.

#### C. Manual Priority Boosts
Staff can override automated weights at any time using the optional `priority` field.
* The user-defined integer (`0`–`100`) is **subtracted directly** from the final penalty score.

---

### 🧬 2. Sorting & Example

Plans are sorted from **lowest** penalty score to **highest**:

```javascript
// Lower score = higher billing priority
ranked.sort((a, b) => a.score - b.score);
```

#### 📌 Scenario Example
A patient presents three active policies:
1. **Plan A**: Medicare — primary subscriber (`relationship: 'self'`)
2. **Plan B**: Commercial — covered as dependent through spouse (`relationship: 'dependent'`)
3. **Plan C**: Manufacturer Discount Coupon — primary subscriber (`relationship: 'self'`)

**Score breakdown:**
* **Plan B (Commercial)**: Base `10` - Subscriber `0` = **Score: `10`**
* **Plan A (Medicare)**: Base `20` - Subscriber `5` = **Score: `15`**
* **Plan C (Coupon)**: Base `40` - Subscriber `5` = **Score: `35`**

**Resulting priority order:**
1. **Plan B (Commercial)** — *Score: 10* → Recommended Primary
2. **Plan A (Medicare)** — *Score: 15* → Recommended Secondary
3. **Plan C (Coupon)** — *Score: 35* → Coupon Placement

> 💡 **Developer Note on COB Priority Hierarchies:**
> While subscriber policies generally outrank dependent policies within the same insurance category, standard COB guidelines require that private Commercial employer insurance be billed before public government programs like Medicare.
>
> Because the algorithm weights `coverageType` (a delta of 10 points) more heavily than the `relationship` modifier (a delta of 5 points), the system correctly prioritizes the dependent Commercial plan over the primary Medicare plan — matching real-world compliance standards.

---

### 🏷️ 3. Semantic Label Wrapping
Once sorted, the array maps user-friendly labels to dashboard cards so staff immediately understands the filing order:
* **Discount Coupons** display as **`Coupon`**.
* **Medicaid Plans** display as **`Medicaid`** (acting as the universal payer of last resort under federal guidelines).
* All remaining plans are assigned sequential tags via an auto-incrementing index: **`Primary`**, **`Secondary`**, **`Tertiary`**.

---

### 🔄 Example Workflow

1. Search or create a patient
2. Add multiple insurance plans
3. PHARMABILL ranks plans instantly
4. Select the top recommended plan
5. If claim fails → proceed to the next ranked option

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
        ↓
User (Technician)
```

---

## ⚠️ Challenges & Tradeoffs

### Real-World Ambiguity

Patients frequently arrive without complete insurance information — especially when they are covered as a dependent on someone else's plan and don't have access to the physical card. Unlike physician office systems that have access to comprehensive patient records, pharmacy benefit data is not centrally accessible. Staff must work with whatever the patient provides and, when necessary, process a cash transaction and rebill once the full insurance information is obtained.

- **Flexible schema design** — BIN is required, but PCN, Group, and Member ID are optional fields. This reflects real drop-off conditions rather than enforcing strict validation that would block workflows when patients arrive with partial information.
- **Manual override capability** — Automated ranking cannot account for every edge case. Staff can apply a manual priority boost to force a specific plan to the top of the billing queue without altering the underlying weights. This also supports dual-billing scenarios where both a private plan and Medicare or Medicaid must be submitted in sequence.

### Accuracy vs Complexity

A fully accurate COB system would require live integration with a HIPAA-compliant medical clearinghouse API to retrieve and verify real-time payer data.

- **Rule-based approximation** — Rather than attempting live adjudication, PHARMABILL creates a structured local record of the insurance plans a patient presents, then applies real-world COB logic to recommend the optimal billing order without requiring external API calls.
- **Workflow efficiency over adjudication replacement** — The goal is not to replicate what a clearinghouse does, but to eliminate the guesswork that technicians face when multiple plans share the same BIN and PCN. This reduces trial-and-error submissions and shortens triage time.

### State Management

In a busy pharmacy environment, technicians frequently context-switch between patients and workstations. Losing track of which patient is currently being processed is a real operational risk.

- **Session-based active patient tracking** — A persistent session variable stores the currently active patient so their context is available across all views without requiring repeated lookups.
- **Persistent UI indicator** — A visible bubble in the navbar displays the active patient's name and date of birth at all times. Staff can switch patients or clear the session at any point, preventing cross-patient billing errors.

---

## 📈 Impact

PHARMABILL is designed to:

* ⏱️ Reduce time spent selecting insurance plans at drop-off
* 🔁 Decrease claim reprocessing cycles caused by incorrect plan selection
* 🧠 Support newer technicians with guided, logic-driven decision-making
* 😊 Improve patient wait times and overall pharmacy experience

---

## 🛠️ How to Use

### 1. Find or Create a Patient
* Use the **Patient Search** card to find a profile by name or date of birth.
* If no profile exists, click **Create New Patient** to start a fresh record.

### 2. Manage Insurance Plans
* From the **Patient Profile**, click **Add New Plan**.
* Enter the four RX identifiers found on the pharmacy benefit card (**BIN, PCN, Group, and Member ID**).
* Select the **Relationship** (Self/Dependent) and **Coverage Type** — these fields drive the automated ranking logic.

### 3. Optimize Billing Rank & View Recommendations
* From the patient profile dashboard view, click the highlighted **Optimize Billing Rank** action card.
* The system executes the core Coordination of Benefits (COB) algorithm to display a complete, scored prioritization stack, detailing exactly why specific coverages are assigned **Primary**, **Secondary**, or **Tertiary** billing flags.
* Click the **Active Patient** link context indicator inside the top global navigation bar at any time to return directly to the main clinical summary hub view.

### 4. Admin Management *(Admin Role Only)*
* Locate the **Staff Directory** utility links accessible directly inside the top global navigation navbar header or the lower **Administrator Tools** home dashboard grid section.
* Register new pharmacy staff personnel profiles, toggle global system permission tiers, or permanently revoke profile access as workforce updates occur.


---

## 📸 Screenshots

| Dashboard View | Patient Search |
| :--- | :--- |
| ![Dashboard Screenshot](./public/images/PharmaBillDashboard.png) | ![Search Screenshot](./public/images/PharmaBillPatientSearch.png) |

| Insurance Ranking | Patient Profile |
| :--- | :--- |
| ![Insurance Ranking Screenshot](./public/images/PharmaBillInsuranceRanking.png) | ![Profile Screenshot](./public/images/PharmaBillPatientProfile.png) |

---

## 🔮 Future Improvements

* **Adjudication Simulator** — Simulate real claim responses (e.g., Prior Authorization Required, Refill Too Soon)
* **Prescription Intake Module** — Support full script entry workflows including medication name, NDC, dosing, and prescriber information (NPI, DEA)
* **Medication API Integration** — Identify generic vs. brand medications at point of entry
* **HIPAA-Compliant Clearinghouse Integration** — Connect to a real payer network to retrieve live insurance benefit data
* **Audit Logging** — Track billing decisions, manual overrides, and claim retry history per patient session

---

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

PHARMABILL was built from firsthand experience watching skilled pharmacy technicians burn time on billing guesswork that a structured system could eliminate. The scope was intentionally focused — a real pharmacy record includes medication details, NDC codes, prescriber NPI and DEA numbers, and much more. Rather than replicate the full clinical record, this project isolates the COB triage decision and builds logic around it: given the insurance plans a patient presents, what is the optimal billing sequence? That focused problem is where the most friction exists day-to-day, and it's what this system is designed to solve.