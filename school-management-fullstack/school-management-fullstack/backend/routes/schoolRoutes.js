const router = require("express").Router();
const school = require("../controllers/schoolController");
const { authMiddleware } = require("../middleware/authMiddleware");
router.get("/public", school.getSchools);
router.get("/profile", authMiddleware, school.getSchoolProfile);
module.exports = router;
