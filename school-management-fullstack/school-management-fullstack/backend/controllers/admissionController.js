const { schoolPool } = require("../config/db");
const admissionService = require("../services/admissionService");

exports.createApplication = async (req, res) => {
  const { studentName, dateOfBirth, parentName, parentPhone, email, classId, academicYearId } = req.body;
  if (!studentName || !parentName || !parentPhone || !classId || !academicYearId)
    return res.status(400).json({ message: "Please provide all required admission details." });
  try {
    const result = await schoolPool.query(
      `INSERT INTO admission_application
       (student_name,date_of_birth,parent_name,parent_phone,email,class_id,academic_year_id)
       SELECT $1,$2,$3,$4,$5,$6,$7
       WHERE EXISTS (
         SELECT 1 FROM academic_class
         WHERE id=$6 AND academic_year_id=$7 AND admission_open=true AND available_seats>0
       )
       RETURNING *`,
      [studentName, dateOfBirth || null, parentName, parentPhone, email || null, classId, academicYearId]
    );
    if (!result.rowCount)
      return res.status(409).json({ message: "Admissions are closed or no seats are available." });
    res.status(201).json({ message: "Application submitted.", application: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to submit application." });
  }
};

exports.confirmPaidAdmission = async (req, res) => {
  // This endpoint must only be called after a verified payment-provider webhook.
  // Do not trust a browser/client-supplied "paid" flag.
  const { applicationId, verifiedPaymentId } = req.body;
  if (!applicationId || !verifiedPaymentId)
    return res.status(400).json({ message: "Application ID and verified payment ID are required." });
  try {
    const student = await admissionService.enrollAfterVerifiedPayment(
      schoolPool, applicationId, verifiedPaymentId
    );
    res.status(201).json({ message: "Student enrolled.", student });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || "Enrollment failed." });
  }
};

exports.searchSchools = async (req, res) => {
  const { academicYear, className } = req.query;

  try {
    const result = await schoolPool.query(
      `SELECT
          school_id,
          school_name,
          academic_year,
          class_name,
          total_seats,
          available_seats,
          admission_open
       FROM school_admission_listing
       WHERE academic_year = $1
         AND class_name = $2
         AND admission_open = TRUE
         AND available_seats > 0
       ORDER BY school_name`,
      [academicYear, className]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Search schools error:", err);
    res.status(500).json({
      message: "Unable to search schools."
    });
  }
};
