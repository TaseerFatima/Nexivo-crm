# Nexivo Real Estate CRM

## Tech Stack
- Frontend: React.js + Tailwind CSS
- Backend:  Node.js + Express.js
- Database: MongoDB + Mongoose
- Auth:     JWT (7 day expiry)

## Quick Start

### Backend
```bash
cd server
npm install
npm run dev        # runs on :5000
```

### Frontend
```bash
cd client
npm install
npm start          # runs on :3000
```

## Folder Structure
server/
  models/       — User, Lead, Task
  routes/       — auth, leads, tasks, reports, users
  controllers/  — authController, leadController
  middleware/   — protect (JWT), roleGuard (RBAC)
  config/       — db.js
  .env          — MONGO_URI, JWT_SECRET, PORT
  index.js      — entry point

client/src/
  pages/        — Dashboard, Leads, Pipeline, Reports, Team
  components/   — common, layout
  context/      — AuthContext
  api/          — axios.js (interceptors)
  utils/        — constants.js
