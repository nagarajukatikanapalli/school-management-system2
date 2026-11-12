const { Pool } = require("pg");
require("dotenv").config();

const masterPool = new Pool({
  connectionString: process.env.MASTER_DATABASE_URL,
  ssl: process.env.DB_SSL === "false" ? false : { rejectUnauthorized: false }
});

// Starter uses a single configured school database. For multiple schools,
// databaseService selects/creates pools using trusted server-side configuration.
const schoolPool = new Pool({
  connectionString: process.env.SCHOOL_DATABASE_URL,
  ssl: process.env.DB_SSL === "false" ? false : { rejectUnauthorized: false }
});

module.exports = { masterPool, schoolPool };
