
const router = require("express").Router();
const admission = require("../controllers/admissionController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/search", admission.searchSchools);
router.post("/apply", admission.createApplication);
router.post("/confirm-paid", authMiddleware, admission.confirmPaidAdmission);

module.exports = router;
