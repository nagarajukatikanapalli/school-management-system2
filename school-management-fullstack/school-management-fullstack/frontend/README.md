# School Management Frontend

## Run
1. Open a terminal in this `frontend` folder.
2. Run `npm install`.
3. Copy `.env.example` to `.env` (or create `.env`) and set:
   `VITE_API_URL=http://localhost:5000/api`
4. Run `npm run dev`.
5. Open the URL printed by Vite, usually http://localhost:5173.

Keep the backend running separately at http://localhost:5000.

## API notes
The frontend calls:
- `POST /auth/signup`
- `POST /auth/login`
- `GET /admissions?academicYear=...&className=...`

If your backend uses different route names or request fields, update `src/services/api.js` and the form payloads.
This is a starter frontend. Payment verification, OTP, document upload, and complete admin workflows need backend implementation.
