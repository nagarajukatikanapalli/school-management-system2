const crypto = require("crypto");

exports.enrollAfterVerifiedPayment = async (pool, applicationId, verifiedPaymentId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const app = await client.query(
      "SELECT * FROM admission_application WHERE id=$1 FOR UPDATE",
      [applicationId]
    );
    if (!app.rowCount) {
      const e = new Error("Application not found."); e.status = 404; throw e;
    }
    const a = app.rows[0];
    if (a.application_status === "ENROLLED") {
      const existing = await client.query("SELECT * FROM student WHERE application_id=$1", [applicationId]);
      await client.query("COMMIT");
      return existing.rows[0];
    }

    const payment = await client.query(
      "SELECT id,payment_status FROM payments WHERE application_id=$1 AND provider_payment_id=$2 FOR UPDATE",
      [applicationId, verifiedPaymentId]
    );
    if (!payment.rowCount || payment.rows[0].payment_status !== "SUCCESS") {
      const e = new Error("A verified successful payment is required."); e.status = 403; throw e;
    }

    const admissionNumber = "ADM-" + crypto.randomBytes(5).toString("hex").toUpperCase();
    const inserted = await client.query(
      `INSERT INTO student
       (admission_number,name,parent_name,parent_phone,class_id,academic_year_id,application_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [admissionNumber,a.student_name,a.parent_name,a.parent_phone,a.class_id,a.academic_year_id,a.id]
    );
    await client.query(
      "UPDATE admission_application SET application_status='ENROLLED' WHERE id=$1",
      [applicationId]
    );
    await client.query(
      "UPDATE academic_class SET available_seats=GREATEST(available_seats-1,0) WHERE id=$1",
      [a.class_id]
    );
    await client.query("COMMIT");
    return inserted.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally { client.release(); }
};
