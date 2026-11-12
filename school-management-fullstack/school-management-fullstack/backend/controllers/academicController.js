
const { schoolPool } = require("../config/db");

// GET ALL ACADEMIC YEARS
exports.getYears = async (req, res) => {
  try {
    const result = await schoolPool.query(
      `SELECT * FROM academic_year ORDER BY id DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Get years error:", err);
    res.status(500).json({ message: "Unable to fetch academic years." });
  }
};

// ADD ACADEMIC YEAR
exports.addYear = async (req, res) => {
  const { yearName, startDate, endDate } = req.body;

  if (!yearName || !startDate || !endDate) {
    return res.status(400).json({
      message: "Year name, start date and end date are required."
    });
  }

  try {
    const result = await schoolPool.query(
      `INSERT INTO academic_year
       (year_name, start_date, end_date, status)
       VALUES ($1, $2, $3, 'INACTIVE')
       RETURNING *`,
      [yearName, startDate, endDate]
    );

    res.status(201).json({
      message: "Academic year added successfully.",
      year: result.rows[0]
    });
  } catch (err) {
    console.error("Add year error:", err);
    res.status(500).json({ message: "Unable to add academic year." });
  }
};

// UPDATE ACADEMIC YEAR
exports.updateYear = async (req, res) => {
  const { yearName, startDate, endDate } = req.body;
  const { id } = req.params;

  try {
    const result = await schoolPool.query(
      `UPDATE academic_year
       SET year_name = $1, start_date = $2, end_date = $3
       WHERE id = $4
       RETURNING *`,
      [yearName, startDate, endDate, id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ message: "Academic year not found." });
    }

    res.json({
      message: "Academic year updated successfully.",
      year: result.rows[0]
    });
  } catch (err) {
    console.error("Update year error:", err);
    res.status(500).json({ message: "Unable to update academic year." });
  }
};

// ACTIVATE ACADEMIC YEAR
exports.activateYear = async (req, res) => {
  const { id } = req.params;
  const client = await schoolPool.connect();

  try {
    await client.query("BEGIN");

    const check = await client.query(
      "SELECT id FROM academic_year WHERE id = $1",
      [id]
    );

    if (!check.rowCount) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Academic year not found." });
    }

    await client.query(
      "UPDATE academic_year SET status = 'INACTIVE'"
    );

    const result = await client.query(
      `UPDATE academic_year
       SET status = 'ACTIVE'
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    await client.query("COMMIT");
    res.json({
      message: "Academic year activated successfully.",
      year: result.rows[0]
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Activate year error:", err);
    res.status(500).json({ message: "Unable to activate academic year." });
  } finally {
    client.release();
  }
};

// DELETE ACADEMIC YEAR
exports.deleteYear = async (req, res) => {
  try {
    const result = await schoolPool.query(
      `DELETE FROM academic_year WHERE id = $1 RETURNING *`,
      [req.params.id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ message: "Academic year not found." });
    }

    res.json({ message: "Academic year deleted successfully." });
  } catch (err) {
    console.error("Delete year error:", err);
    res.status(500).json({
      message: "Unable to delete year. It may contain classes."
    });
  }
};

// GET CLASSES
exports.getClasses = async (req, res) => {
  try {
    const result = await schoolPool.query(
      `SELECT c.*, y.year_name
       FROM academic_class c
       JOIN academic_year y ON y.id = c.academic_year_id
       ORDER BY c.id`
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Get classes error:", err);
    res.status(500).json({ message: "Unable to fetch classes." });
  }
};

// ADD CLASS
exports.addClass = async (req, res) => {
  const { className, academicYearId, totalSeats } = req.body;

  if (!className || !academicYearId || totalSeats == null) {
    return res.status(400).json({
      message: "Class name, academic year and total seats are required."
    });
  }

  const seats = Number(totalSeats);

  if (!Number.isInteger(seats) || seats < 0) {
    return res.status(400).json({ message: "Invalid total seats." });
  }

  try {
    const result = await schoolPool.query(
      `INSERT INTO academic_class
       (class_name, academic_year_id, total_seats, available_seats, admission_open)
       VALUES ($1, $2, $3, $3, FALSE)
       RETURNING *`,
      [className, academicYearId, seats]
    );

    res.status(201).json({
      message: "Class added successfully.",
      class: result.rows[0]
    });
  } catch (err) {
    console.error("Add class error:", err);
    res.status(500).json({ message: "Unable to add class." });
  }
};

// UPDATE CLASS
exports.updateClass = async (req, res) => {
  const { className, academicYearId, totalSeats } = req.body;
  const seats = Number(totalSeats);

  if (!className || !academicYearId ||
      !Number.isInteger(seats) || seats < 0) {
    return res.status(400).json({ message: "Invalid class details." });
  }

  try {
    const result = await schoolPool.query(
      `UPDATE academic_class
       SET class_name = $1,
           academic_year_id = $2,
           total_seats = $3,
           available_seats = LEAST(available_seats, $3)
       WHERE id = $4
       RETURNING *`,
      [className, academicYearId, seats, req.params.id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ message: "Class not found." });
    }

    res.json({
      message: "Class updated successfully.",
      class: result.rows[0]
    });
  } catch (err) {
    console.error("Update class error:", err);
    res.status(500).json({ message: "Unable to update class." });
  }
};

// OPEN / CLOSE CLASS ADMISSIONS
exports.updateAdmissionStatus = async (req, res) => {
  const { admissionOpen } = req.body;

  if (typeof admissionOpen !== "boolean") {
    return res.status(400).json({
      message: "Admission status must be true or false."
    });
  }

  try {
    const result = await schoolPool.query(
      `UPDATE academic_class
       SET admission_open = $1
       WHERE id = $2
       RETURNING *`,
      [admissionOpen, req.params.id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ message: "Class not found." });
    }

    res.json({
      message: "Admission status updated.",
      class: result.rows[0]
    });
  } catch (err) {
    console.error("Admission status error:", err);
    res.status(500).json({ message: "Unable to update admission status." });
  }
};

// DELETE CLASS
exports.deleteClass = async (req, res) => {
  try {
    const result = await schoolPool.query(
      `DELETE FROM academic_class WHERE id = $1 RETURNING *`,
      [req.params.id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ message: "Class not found." });
    }

    res.json({ message: "Class deleted successfully." });
  } catch (err) {
    console.error("Delete class error:", err);
    res.status(500).json({ message: "Unable to delete class." });
  }
};

// GET SECTIONS
exports.getSections = async (req, res) => {
  try {
    const result = await schoolPool.query(
      `SELECT s.*, c.class_name, y.year_name
       FROM academic_section s
       JOIN academic_class c ON c.id = s.class_id
       JOIN academic_year y ON y.id = c.academic_year_id
       ORDER BY c.id, s.section_name`
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Get sections error:", err);
    res.status(500).json({ message: "Unable to fetch sections." });
  }
};

// ADD SECTION
exports.addSection = async (req, res) => {
  const { classId, sectionName, totalSeats } = req.body;

  if (!classId || !sectionName || totalSeats == null) {
    return res.status(400).json({
      message: "Class, section name and total seats are required."
    });
  }

  const seats = Number(totalSeats);

  if (!Number.isInteger(seats) || seats < 0) {
    return res.status(400).json({ message: "Invalid total seats." });
  }

  try {
    const result = await schoolPool.query(
      `INSERT INTO academic_section
       (class_id, section_name, total_seats, available_seats)
       VALUES ($1, $2, $3, $3)
       RETURNING *`,
      [classId, sectionName.trim(), seats]
    );

    res.status(201).json({
      message: "Section added successfully.",
      section: result.rows[0]
    });
  } catch (err) {
    console.error("Add section error:", err);
    if (err.code === "23505") {
      return res.status(409).json({
        message: "This section already exists for the selected class."
      });
    }
    res.status(500).json({ message: "Unable to add section." });
  }
};

// UPDATE SECTION
exports.updateSection = async (req, res) => {
  const { sectionName, totalSeats, status } = req.body;
  const seats = Number(totalSeats);

  if (!sectionName || !Number.isInteger(seats) || seats < 0) {
    return res.status(400).json({ message: "Invalid section details." });
  }

  try {
    const result = await schoolPool.query(
      `UPDATE academic_section
       SET section_name = $1,
           total_seats = $2,
           available_seats = LEAST(available_seats, $2),
           status = COALESCE($3, status)
       WHERE id = $4
       RETURNING *`,
      [sectionName.trim(), seats, status || null, req.params.id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ message: "Section not found." });
    }

    res.json({
      message: "Section updated successfully.",
      section: result.rows[0]
    });
  } catch (err) {
    console.error("Update section error:", err);
    res.status(500).json({ message: "Unable to update section." });
  }
};

// DELETE SECTION
exports.deleteSection = async (req, res) => {
  try {
    const result = await schoolPool.query(
      `DELETE FROM academic_section WHERE id = $1 RETURNING *`,
      [req.params.id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ message: "Section not found." });
    }

    res.json({ message: "Section deleted successfully." });
  } catch (err) {
    console.error("Delete section error:", err);
    res.status(500).json({ message: "Unable to delete section." });
  }
};
