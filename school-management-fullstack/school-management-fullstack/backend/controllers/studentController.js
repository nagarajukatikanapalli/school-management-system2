const { schoolPool } = require("../config/db");

exports.listStudents = async (_req, res) => {
  try {
    const result = await schoolPool.query(
      "SELECT id,admission_number,name,parent_name,parent_phone,class_id,academic_year_id,created_at FROM student ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to fetch students. Check school database schema." });
  }
};
