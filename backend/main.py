from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from backend.database import init_db
from backend.routes import auth, schemes, compliance, proposals, applications, jobs, documents, dashboard
from backend.routes import match


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="GovBridge GrantMate API",
    description="AI-powered GovTech platform connecting government funding to local employment",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(schemes.router, prefix="/api/schemes", tags=["Schemes"])
app.include_router(match.router, prefix="/api", tags=["Matching"])
app.include_router(compliance.router, prefix="/api", tags=["Compliance"])
app.include_router(documents.router, prefix="/api/documents", tags=["Documents"])
app.include_router(proposals.router, prefix="/api/generate", tags=["Generate"])
app.include_router(applications.router, prefix="/api/applications", tags=["Applications"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])


@app.get("/")
def root():
    return {"message": "GovBridge GrantMate API", "version": "1.0.0"}
