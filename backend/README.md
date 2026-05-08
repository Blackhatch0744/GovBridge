# GovBridge GrantMate — Backend

AI-powered GovTech platform connecting government funding to local employment.

## Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
cp .env.example .env         # Fill in your keys
python -m backend.seed.seed  # Seed database
uvicorn backend.main:app --reload
```

## API Docs

Once running, visit: http://localhost:8000/docs

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL (Neon) via async SQLAlchemy
- **AI**: Google Gemini 1.5 Flash (6-key rotation)
- **Auth**: JWT with dev-test-token bypass
