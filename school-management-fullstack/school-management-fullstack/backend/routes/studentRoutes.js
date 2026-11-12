const router = require("express").Router();
const student = require("../controllers/studentController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
router.get("/", authMiddleware, allowRoles("SUPER_ADMIN","PRINCIPAL","TEACHER","ADMINISTRATION","ACCOUNTANT"), student.listStudents);
module.exports = router;
