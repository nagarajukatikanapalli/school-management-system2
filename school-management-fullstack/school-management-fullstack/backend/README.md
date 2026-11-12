# School Management Backend

This folder follows the requested backend structure.

## Setup
1. Install Node.js LTS.
2. Open this folder in VS Code.
3. Edit `.env` with your real Neon PostgreSQL connection strings.
   - `MASTER_DATABASE_URL`: connection string for `master_db`
   - `SCHOOL_DATABASE_URL`: connection string for your school database, e.g. `nagaraju_db`
4. Replace `JWT_SECRET` with a long random secret. Never share or commit `.env`.
5. Run:
   ```bash
   npm install
   npm run dev
   ```
6. Test `http://localhost:5000/api/health`.

## Required tables
This backend expects the `master_school`, `master_user`, `school_admission_listing` tables in master_db, and `admission_application`, `academic_class`, `payments`, `student` tables in the school database. Use the SQL schemas from your existing project ZIP, or create these tables before testing the APIs.

## API routes
- POST `/api/auth/signup`
- POST `/api/auth/signin`
- GET `/api/schools/public?academicYear=2026-2027&className=Class%201`
- GET `/api/schools/profile` (Bearer token)
- GET `/api/students` (Bearer token)
- POST `/api/admissions/apply`
- POST `/api/admissions/confirm-paid` (Bearer token; only after a verified provider webhook updates payment status)

## Important limitations
- `.env` contains placeholders; you must replace them.
- School signup saves records in master_db, but does not automatically create a Neon database.
- OTP/email, payment gateway/webhook verification, full database-per-school pool routing, and complete permission mapping are not implemented. Do not expose `confirm-paid` to public clients or treat client claims as proof of payment. Build a trusted payment-provider webhook before production.
