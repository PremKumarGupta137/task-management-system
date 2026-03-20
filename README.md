# 📋 TaskLedger — Task Management System
 
> Built for **Earnest Data Analytics** Software Engineering Assessment  
> Track A: Full-Stack Engineer (Backend + Web Frontend)
 
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/PremKumarGupta137/task-management-system)
 
---
 
## 📌 About This Project
 
TaskLedger is a **production-ready, full-stack Task Management System** built as part of the **Earnest Data Analytics Software Engineering Recruitment Assessment**. The system allows users to securely register, log in, and perform complete management of their personal tasks through a clean, classic, and responsive interface.
 
---
 
## ✨ Features Implemented
 
### 🔐 Authentication & Security
- ✅ User Registration with full validation
- ✅ User Login with email & password
- ✅ JWT Access Tokens (short-lived, 15 minutes)
- ✅ JWT Refresh Tokens (long-lived, 7 days)
- ✅ Automatic token refresh — user stays logged in seamlessly
- ✅ Token rotation on every refresh for maximum security
- ✅ Password hashing using **bcrypt** (12 salt rounds)
- ✅ Secure Logout with token revocation from database
 
### 📋 Task Management (Full CRUD)
- ✅ Create tasks with title and description
- ✅ View all tasks in a clean ledger-style layout
- ✅ Edit tasks via modal form
- ✅ Delete tasks instantly
- ✅ Toggle task status (Pending ↔ Completed)
 
### 🔍 Advanced Task Features
- ✅ **Pagination** — tasks loaded in batches of 8
- ✅ **Search** — search tasks by title
- ✅ **Filter** — filter by status (All / Pending / Completed)
- ✅ **Live stats** — total, pending, and completed counts
 
### 🎨 UI/UX
- ✅ Fully **responsive design** — works on mobile and desktop
- ✅ Classic parchment theme with Playfair Display serif typography
- ✅ Toast notifications for all actions (react-hot-toast)
- ✅ Loading states and smooth fade animations
- ✅ Empty states with helpful prompts
- ✅ Modal dialogs for Add and Edit operations
 
---
 
## 🛠️ Tech Stack
 
### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | Server runtime |
| **Express.js** | Web framework |
| **TypeScript** | Type safety throughout |
| **Prisma ORM** | Database access & migrations |
| **PostgreSQL** | Production database |
| **SQLite** | Local development database |
| **JWT (jsonwebtoken)** | Access & refresh token auth |
| **bcryptjs** | Password hashing |
 
### Frontend
| Technology | Purpose |
|-----------|---------|
| **Next.js 14** | React framework (App Router) |
| **TypeScript** | Type safety throughout |
| **Tailwind CSS** | Utility-first styling |
| **Axios** | HTTP client with interceptors |
| **react-hot-toast** | Toast notifications |
 
---
 
## 📁 Project Structure
 
```
task-management-system/
├── backend/                        # Node.js + TypeScript API
│   ├── prisma/
│   │   └── schema.prisma           # Database schema
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.ts   # Register, Login, Refresh, Logout
│   │   │   └── taskController.ts   # CRUD + Toggle + Pagination
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts   # JWT verification
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   └── taskRoutes.ts
│   │   ├── prisma/
│   │   │   └── client.ts           # Prisma singleton
│   │   └── index.ts                # Express server entry
│   └── package.json
│
└── frontend/                       # Next.js 14 + TypeScript
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx          # Root layout + Toaster
    │   │   ├── page.tsx            # Redirects to /login
    │   │   ├── login/
    │   │   │   └── page.tsx        # Login page
    │   │   ├── register/
    │   │   │   └── page.tsx        # Register page
    │   │   └── dashboard/
    │   │       └── page.tsx        # Main task dashboard
    │   └── lib/
    │       └── api.ts              # Axios + auto token refresh
    └── package.json
```
 
---
 
## 🔌 API Endpoints
 
### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout user |
 
### Tasks (All require Bearer token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks (paginated, filterable) |
| POST | `/api/tasks` | Create new task |
| GET | `/api/tasks/:id` | Get single task |
| PATCH | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| PATCH | `/api/tasks/:id/toggle` | Toggle task status |
 
### Query Parameters for GET /api/tasks
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 8, max: 50) |
| `status` | string | Filter by `pending` or `completed` |
| `search` | string | Search by task title |
 
---
 
## 🗄️ Database Schema
 
```prisma
model User {
  id           String   @id @default(cuid())
  name         String
  email        String   @unique
  password     String
  refreshToken String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  tasks        Task[]
}
 
model Task {
  id          String   @id @default(cuid())
  title       String
  description String?
  status      String   @default("pending")
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```
 
---
 
## 🚀 Running Locally
 
### Prerequisites
- **Node.js** v18+ — https://nodejs.org
- **Git** — https://git-scm.com
 
### Step 1 — Clone the repository
```bash
git clone https://github.com/PremKumarGupta137/task-management-system.git
cd task-management-system
```
 
### Step 2 — Setup Backend
```bash
cd backend
npm install
```
 
The `.env` file is already included. Run migrations:
```bash
npx prisma migrate dev --name init
npx prisma generate
```
 
Start the backend:
```bash
npm run dev
```
✅ Backend running at **http://localhost:5000**
 
### Step 3 — Setup Frontend
Open a **new terminal**:
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend running at **http://localhost:3000**
 
### Step 4 — Open in browser
```
http://localhost:3000
```
 
---
 
## 🔒 Security Features
 
- **JWT Access Tokens** — expire in 15 minutes
- **JWT Refresh Tokens** — expire in 7 days, stored in database
- **Token Rotation** — new refresh token issued on every refresh
- **bcrypt** — passwords hashed with 12 salt rounds
- **Input Validation** — all inputs validated on backend
- **CORS Protection** — only allowed origins can access the API
- **User Isolation** — users can only access their own tasks
 
---
 
## 👨‍💻 Developer
 
**Prem Kumar Gupta**  
GitHub: [@PremKumarGupta137](https://github.com/PremKumarGupta137)
 
---
 
## 📄 Assignment Details
 
- **Company:** Earnest Data Analytics
- **Role:** Full-Stack Engineer
- **Track:** Track A — Backend (Node.js) + Web Frontend (Next.js)
- **Assessment:** Task Management System
 
---
 
*Built with ❤️ for Earnest Data Analytics Recruitment Drive*
