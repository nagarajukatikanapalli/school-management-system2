const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { masterPool } = require("../config/db");


exports.signup = async (req, res) => {
  const {
    schoolId,
    schoolName,
    email,
    phone,
    password,
    databaseName
  } = req.body || {};

  if (!schoolId || !schoolName || !email || !password || !databaseName) {
    return res.status(400).json({
      message: "School ID, name, email, password and database name are required."
    });
  }

  if (password.length < 10) {
    return res.status(400).json({
      message: "Password must contain at least 10 characters."
    });
  }

  let client;
  let transactionStarted = false;

  try {
    client = await masterPool.connect();

    await client.query("BEGIN");
    transactionStarted = true;

    // Check whether school ID, email or database name already exists
    const duplicate = await client.query(
      `SELECT school_id, email, database_name
       FROM master_school
       WHERE school_id = $1 OR email = $2 OR database_name = $3`,
      [schoolId, email, databaseName]
    );

    if (duplicate.rowCount > 0) {
      await client.query("ROLLBACK");
      transactionStarted = false;

      return res.status(409).json({
        message: "School ID, email or database name already exists."
      });
    }

    // Securely hash password
    const hash = await bcrypt.hash(password, 12);

    // Save school details
    await client.query(
      `INSERT INTO master_school
       (school_id, school_name, email, phone, database_name, status)
       VALUES ($1, $2, $3, $4, $5, 'PENDING')`,
      [schoolId, schoolName, email, phone || null, databaseName]
    );

    // Save admin login details
    await client.query(
      `INSERT INTO master_user
       (school_id, email, password_hash)
       VALUES ($1, $2, $3)`,
      [schoolId, email, hash]
    );

    await client.query("COMMIT");
    transactionStarted = false;

    return res.status(201).json({
      message: "School registration successful. Waiting for activation."
    });

  } catch (err) {
    if (client && transactionStarted) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackError) {
        console.error("Rollback error:", rollbackError.message);
      }
    }

    console.error("Signup error:", {
      code: err.code,
      message: err.message,
      detail: err.detail,
      constraint: err.constraint
    });

    if (err.code === "23505") {
      return res.status(409).json({
        message: "School ID, email or database name already exists."
      });
    }

    return res.status(500).json({
      message: "Signup failed. Check the backend terminal for details."
    });

  } finally {
    if (client) client.release();
  }
};


exports.signin = async (req, res) => {
  const { schoolId, email, password } = req.body;
  if (!schoolId || !email || !password)
    return res.status(400).json({ message: "School ID, email and password are required." });
  try {
    const result = await masterPool.query(
      `SELECT u.password_hash,s.school_id,s.school_name,s.database_name,s.status
       FROM master_user u JOIN master_school s ON s.school_id=u.school_id
       WHERE u.school_id=$1 AND u.email=$2`,
      [schoolId, email]
    );
    if (!result.rowCount) return res.status(401).json({ message: "Invalid credentials." });
    const row = result.rows[0];
    if (row.status !== "ACTIVE")
      return res.status(403).json({ message: "School account is not active." });
    if (!(await bcrypt.compare(password, row.password_hash)))
      return res.status(401).json({ message: "Invalid credentials." });
    const token = jwt.sign(
      { schoolId: row.school_id, databaseName: row.database_name, role: "SUPER_ADMIN" },
      process.env.JWT_SECRET, { expiresIn: "2h" }
    );
    res.json({ token, school: { schoolId: row.school_id, schoolName: row.school_name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signin failed." });
  }
};
