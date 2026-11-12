const { masterPool } = require("../config/db");

exports.getSchools = async (req, res) => {
  try {
    const { academicYear, className } = req.query;
    const result = await masterPool.query(
      `SELECT school_id,school_name,academic_year,class_name,available_seats,total_seats
       FROM school_admission_listing
       WHERE admission_open=true AND available_seats>0
       AND ($1::text IS NULL OR academic_year=$1)
       AND ($2::text IS NULL OR class_name=$2)
       ORDER BY school_name`,
      [academicYear || null, className || null]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to fetch schools." });
  }
};

exports.getSchoolProfile = async (req, res) => {
  try {
    const result = await masterPool.query(
      "SELECT school_id,school_name,email,phone,status,database_name FROM master_school WHERE school_id=$1",
      [req.auth.schoolId]
    );
    if (!result.rowCount) return res.status(404).json({ message: "School not found." });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to fetch school profile." });
  }
};
