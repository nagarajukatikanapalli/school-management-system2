# School Management System — Frontend + Backend

Includes React/Vite frontend, Node/Express backend, Neon PostgreSQL SQL scripts, and the requested backend MVC folders (config, controllers, routes, middleware, services).

## Requirements
- Node.js LTS
- VS Code
- Neon account

## Neon setup
Create a Neon project, then create databases named `master_db` and `nagaraju_db` (or choose your own names and update the connection strings).
Run `database/master_schema.sql` in `master_db` and `database/school_schema.sql` in `nagaraju_db` using Neon's SQL Editor.

## Backend
Open terminal in `backend`:
1. Copy `.env.example` to `.env`.
2. Fill `MASTER_DATABASE_URL`, `SCHOOL_DATABASE_URL`, and a strong random `JWT_SECRET`.
3. Run `npm install` then `npm run dev`.

## Frontend
Open a second terminal in `frontend`:
1. Copy `.env.example` to `.env`.
2. Run `npm install` then `npm run dev`.
3. Open the Vite URL, normally http://localhost:5173.

## Included starter flows
- School signup and login API
- School public open-admission search UI/API
- Student and admission controller/service/routes scaffolding
- School, employee, student, academic year/class, role, permission, application and payment SQL tables

## Important limitations
This is a development starter, not a production-ready system. Signup records the database name but does not provision a new Neon database automatically. School activation/admin approval, email OTP, full CRUD screens, complete RBAC enforcement, document storage, payment gateway checkout/webhook verification, and automatic student enrollment after verified payment still need to be implemented and tested. Never put Neon credentials or management API keys in frontend code. Do not use real student data until privacy/security controls are complete.
