const router = require("express").Router();
const auth = require("../controllers/authController");
router.post("/signup", auth.signup);
router.post("/signin", auth.signin);
module.exports = router;
