from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.application import Application
from backend.models.scheme import Scheme
from backend.models.user import User
from backend.models.job_listing import JobListing
from backend.agents.jobs_bridge import bridge_jobs
from backend.schemas.application import ApplicationCreate, ApplicationUpdate
from backend.routes.auth import get_current_user

router = APIRouter()

VALID_STATUSES = ["draft", "submitted", "under_review", "approved", "rejected", "funded"]


@router.post("/")
def create_application(body: ApplicationCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    scheme = db.query(Scheme).filter(Scheme.id == body.scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    app = Application(
        user_id=current_user.id,
        scheme_id=body.scheme_id,
        proposal_id=body.proposal_id,
        status="draft",
    )
    db.add(app)
    db.commit()
    db.refresh(app)
    return {
        "id": app.id, "user_id": app.user_id, "scheme_id": app.scheme_id,
        "proposal_id": app.proposal_id, "status": app.status,
        "submitted_at": str(app.submitted_at) if app.submitted_at else None,
        "updated_at": str(app.updated_at) if app.updated_at else None,
    }


@router.get("/")
def list_applications(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    apps = db.query(Application).filter(Application.user_id == current_user.id).all()
    results = []
    for a in apps:
        scheme = db.query(Scheme).filter(Scheme.id == a.scheme_id).first()
        results.append({
            "id": a.id, "user_id": a.user_id, "scheme_id": a.scheme_id,
            "scheme_name": scheme.name if scheme else "",
            "proposal_id": a.proposal_id, "status": a.status,
            "submitted_at": str(a.submitted_at) if a.submitted_at else None,
            "updated_at": str(a.updated_at) if a.updated_at else None,
        })
    return results


@router.get("/{app_id}")
def get_application(app_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    app = db.query(Application).filter(Application.id == app_id, Application.user_id == current_user.id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    scheme = db.query(Scheme).filter(Scheme.id == app.scheme_id).first()
    return {
        "id": app.id, "user_id": app.user_id, "scheme_id": app.scheme_id,
        "scheme_name": scheme.name if scheme else "",
        "proposal_id": app.proposal_id, "status": app.status,
        "submitted_at": str(app.submitted_at) if app.submitted_at else None,
        "updated_at": str(app.updated_at) if app.updated_at else None,
    }


@router.put("/{app_id}")
def update_application(app_id: int, body: ApplicationUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    app = db.query(Application).filter(Application.id == app_id, Application.user_id == current_user.id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    if body.status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {VALID_STATUSES}")

    app.status = body.status
    if body.status == "submitted":
        app.submitted_at = datetime.utcnow()

    db.commit()
    db.refresh(app)

    if body.status == "funded":
        try:
            scheme = db.query(Scheme).filter(Scheme.id == app.scheme_id).first()
            user = db.query(User).filter(User.id == app.user_id).first()
            if scheme and user:
                scheme_data = {
                    "id": scheme.id, "name": scheme.name,
                    "funding_min": scheme.funding_min, "funding_max": scheme.funding_max,
                }
                user_data = {
                    "id": user.id, "name": user.name, "entity_type": user.entity_type,
                    "industry": user.industry or "", "location": user.location or "",
                }
                job_data = bridge_jobs(
                    application_data={"id": app.id, "status": app.status},
                    scheme_data=scheme_data,
                    user_data=user_data,
                )
                job = JobListing(
                    business_user_id=user.id,
                    application_id=app.id,
                    role_title=job_data["role_title"],
                    description=job_data["description"],
                    pay_min=job_data["pay_min"],
                    pay_max=job_data["pay_max"],
                    location=user.location or "",
                    skills=job_data["skills"],
                    status="open",
                )
                db.add(job)
                db.commit()
        except Exception:
            pass

    return {
        "id": app.id, "user_id": app.user_id, "scheme_id": app.scheme_id,
        "proposal_id": app.proposal_id, "status": app.status,
        "submitted_at": str(app.submitted_at) if app.submitted_at else None,
        "updated_at": str(app.updated_at) if app.updated_at else None,
    }
