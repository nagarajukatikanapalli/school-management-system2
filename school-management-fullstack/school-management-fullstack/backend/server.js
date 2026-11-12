require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { checkConnections } = require("./services/databaseService");

const app = express();
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => res.json({ message: "School Management API is running" }));
app.get("/api/health", async (_req, res) => {
  try { res.json({ status: "ok", databases: await checkConnections() }); }
  catch (e) { console.error(e); res.status(500).json({ status: "error", message: "Database connection failed" }); }
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/schools", require("./routes/schoolRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/admissions", require("./routes/admissionRoutes"));
app.use("/api/academic", require("./routes/academicRoutes"));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Unexpected server error." });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Backend running at http://localhost:${port}`));

