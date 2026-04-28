# Student Project Management System

Frontend: React + Vite  
Backend: Node.js + Express (in-memory dummy data)

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start backend only:

```bash
npm run server
```

3. Start frontend only:

```bash
npm run dev
```

4. Start both together:

```bash
npm run dev:full
```

## API base URL

- Backend runs on `http://localhost:5001`
- Frontend can use:
  - Vite proxy with `/api`
  - or `VITE_API_BASE_URL=/api`

## Main API endpoints

- `GET /api/health`
- `POST /api/auth/login`
- `POST /api/auth/signup`
- `GET /api/users?role=student`
- `GET /api/projects?role=admin|student&userId=<id>`
- `GET /api/projects/:projectId`
- `POST /api/projects`
- `PATCH /api/projects/:projectId/tasks/:taskId`
- `POST /api/projects/:projectId/submissions`
