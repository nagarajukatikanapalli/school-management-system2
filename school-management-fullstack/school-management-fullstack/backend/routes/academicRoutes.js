
const router = require("express").Router();
const academic = require("../controllers/academicController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Academic years
router.get("/years", authMiddleware, academic.getYears);
router.post("/years", authMiddleware, academic.addYear);
router.put("/years/:id", authMiddleware, academic.updateYear);
router.patch("/years/:id/activate", authMiddleware, academic.activateYear);
router.delete("/years/:id", authMiddleware, academic.deleteYear);

// Classes
router.get("/classes", authMiddleware, academic.getClasses);
router.post("/classes", authMiddleware, academic.addClass);
router.put("/classes/:id", authMiddleware, academic.updateClass);
router.patch("/classes/:id/admission", authMiddleware, academic.updateAdmissionStatus);
router.delete("/classes/:id", authMiddleware, academic.deleteClass);

// Sections
router.get("/sections", authMiddleware, academic.getSections);
router.post("/sections", authMiddleware, academic.addSection);
router.put("/sections/:id", authMiddleware, academic.updateSection);
router.delete("/sections/:id", authMiddleware, academic.deleteSection);

module.exports = router;
