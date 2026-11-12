// Database provisioning placeholder.
// Create Neon databases only from a trusted backend using Neon Management API credentials.
// Never put Neon API keys or database credentials in frontend code.
// For now, config/db.js connects to MASTER_DATABASE_URL and SCHOOL_DATABASE_URL.
const { masterPool, schoolPool } = require("../config/db");

exports.checkConnections = async () => {
  const [master, school] = await Promise.all([
    masterPool.query("SELECT current_database() AS name"),
    schoolPool.query("SELECT current_database() AS name")
  ]);
  return { master: master.rows[0].name, school: school.rows[0].name };
};

exports.getSchoolPool = (_schoolId) => {
  // TODO: resolve an allow-listed database URL from master_school and return
  // a cached Pool. Never accept a raw connection string from a request.
  return schoolPool;
};
