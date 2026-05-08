# GovBridge GrantMate

AI-powered GovTech platform connecting government funding to local employment.

## Overview

GovBridge GrantMate helps MSMEs, startups, and NGOs discover government funding schemes, verify document compliance, generate AI-powered grant proposals, and create local employment — all from a single platform.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 · React 18 · Framer Motion · Tailwind |
| Backend | FastAPI · SQLAlchemy · PostgreSQL (Neon) |
| AI | Google Gemini 1.5 Flash (6-key rotation) |
| Storage | Supabase (documents) |
| Auth | JWT (python-jose + passlib/bcrypt) |

## Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env       # Fill in your keys
python -m backend.seed.seed # Seed database with 15 schemes + 2 users
uvicorn backend.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — landing page.

### Test Credentials (from seed)

| User | Email | Password |
|---|---|---|
| Priya Sharma (MSME) | priya@kumarfoods.in | password123 |
| Arjun Mehta (Startup) | arjun@techstart.io | password123 |

Or use `dev-test-token` as Bearer token for API testing.

## API Routes

| Method | Route | Description |
|---|---|---|
| POST | /api/auth/signup | Create account + auto-match schemes |
| POST | /api/auth/login | Login, get JWT |
| GET | /api/auth/me | Current user |
| GET | /api/schemes | List all schemes |
| GET | /api/schemes/:id | Scheme details |
| POST | /api/match | AI scheme matching (button-triggered) |
| POST | /api/compliance | Compliance check (pure math) |
| POST | /api/documents/upload | Upload document |
| GET | /api/documents | List documents |
| POST | /api/generate/proposal | AI proposal generation |
| POST | /api/generate/impact | AI impact statement |
| POST | /api/applications | Create application |
| GET | /api/applications | List applications |
| GET | /api/applications/:id | Application details |
| PUT | /api/applications/:id | Update status (funded → creates job) |
| GET | /api/jobs | List job listings |
| POST | /api/jobs/apply/:id | Apply to job |
| GET | /api/dashboard/summary | Dashboard data (DB only, no AI) |

## Architecture

```
GovHack2/
├── backend/
│   ├── agents/          # 5 AI agents (Gemini)
│   ├── config/          # Settings + Gemini key rotation
│   ├── models/          # 9 SQLAlchemy models
│   ├── routes/          # 10 route files, 18 endpoints
│   ├── schemas/         # Pydantic request/response
│   ├── seed/            # 15 schemes + seed script
│   └── main.py          # FastAPI entry
├── frontend/
│   ├── app/             # Next.js pages
│   ├── components/      # React components
│   ├── lib/             # API client + mock data
│   └── ...config files
└── README.md
```

## AI Call Discipline

- AI agents are **never** called on page load
- All AI calls are **user-button-triggered only**
- Results are **cached in-memory** per server session
- **Rate limiting**: 30s (match), 60s (proposal/impact)
- **Fallback**: All agents return template data on failure

## Phases

1. **Design System** — Color tokens, typography, motion, folder structure
2. **Backend** — Models, routes, agents, seed data, auth
3. **Frontend Landing** — Hero, workflow, features, storytelling, auth pages
4. **Frontend Dashboard** — 7 pages, 20+ components, onboarding flow
5. **Integration** — API wiring, mock fallbacks, final polish
