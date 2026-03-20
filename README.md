# Task Management System

A full-stack Task Management System built with **Node.js + TypeScript + Prisma (SQLite)** for the backend and **Next.js 14 + Tailwind CSS** for the frontend.

---

## Project Structure

```
task-management-system/
├── backend/         # Node.js + TypeScript + Prisma API
└── frontend/        # Next.js 14 + Tailwind CSS web app
```

---

## Backend Setup

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Set up environment
The `.env` file is already included with default values. Update secrets for production:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
ACCESS_TOKEN_EXPIRY="15m"
REFRESH_TOKEN_EXPIRY="7d"
PORT=5000
```

### 3. Run Prisma migrations (creates the SQLite database)
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Start the dev server
```bash
npm run dev
```

The API will be running at **http://localhost:5000**

---

## Frontend Setup

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Environment (already configured)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Start the dev server
```bash
npm run dev
```

The app will be running at **http://localhost:3000**

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get tokens |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout and invalidate token |

### Tasks (all protected — require Bearer token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get tasks (pagination, filter, search) |
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks/:id` | Get a single task |
| PATCH | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |
| PATCH | `/api/tasks/:id/toggle` | Toggle task status |

### Query Parameters for GET /api/tasks
- `page` — page number (default: 1)
- `limit` — items per page (default: 10, max: 50)
- `status` — filter by `pending` or `completed`
- `search` — search by title

---

## Features

### Backend
- JWT Authentication with Access Token (15m) + Refresh Token (7d)
- Auto token refresh stored in database
- Prisma ORM with SQLite (easy to swap to PostgreSQL/MySQL)
- Full CRUD for tasks with ownership protection
- Pagination, filtering, and search on task list
- Proper TypeScript types throughout
- Input validation and error handling with correct HTTP status codes

### Frontend
- Dark, modern UI with Syne + DM Sans fonts
- Login & Register pages with toast notifications
- Dashboard with task list, stats, search, filter pills
- Add / Edit task modals
- Toggle task status with visual checkbox
- Pagination controls
- Auto token refresh via Axios interceptor
- Responsive design
