require("dotenv").config();
require("./db/connection");

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const methodOverride = require("method-override");
const morgan = require("morgan");

const insuranceController = require("./controllers/insurances");
const patientController = require("./controllers/patients")
const authRoutes = require("./controllers/auth");
const userRoutes = require("./controllers/users");

const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const authRequired = require("./middleware/authRequired");
const viewData = require("./middleware/viewData");

// =======================

// MIDDLEWARE

// =======================

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(morgan("dev"));

// =======================

// VIEW ENGINE

// =======================

app.set("view engine", "ejs");

// =======================

// ROUTES

// =======================
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  }),
);

app.use(viewData);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.use("/patients", authRequired, patientController);
app.use("/patients/:patientId/billing", authRequired, insuranceController);
app.use("/user", authRequired, userRoutes);


// =======================

// 404 CATCH ALL

// =======================

app.get("*path", (req, res) => {
  res.render("error.ejs", { err: "Page Not Found" });
});

// =======================

// SERVER START

// =======================

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
