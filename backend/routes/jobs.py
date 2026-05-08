from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.job_listing import JobListing
from backend.models.job_application import JobApplication
from backend.schemas.job import JobApplyRequest
from backend.routes.auth import get_current_user

router = APIRouter()


@router.get("/")
def list_jobs(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    jobs = db.query(JobListing).filter(JobListing.status == "open").all()
    return [
        {
            "id": j.id, "business_user_id": j.business_user_id,
            "application_id": j.application_id,
            "role_title": j.role_title, "description": j.description,
            "pay_min": j.pay_min, "pay_max": j.pay_max,
            "location": j.location, "skills": j.skills or [],
            "status": j.status, "created_at": str(j.created_at),
        }
        for j in jobs
    ]


@router.post("/apply/{job_id}")
def apply_to_job(job_id: int, body: JobApplyRequest, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    job = db.query(JobListing).filter(JobListing.id == job_id, JobListing.status == "open").first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found or closed")

    existing = db.query(JobApplication).filter(
        JobApplication.job_listing_id == job_id,
        JobApplication.applicant_user_id == current_user.id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already applied to this job")

    application = JobApplication(
        job_listing_id=job_id,
        applicant_user_id=current_user.id,
        resume_url=body.resume_url or "",
        status="applied",
    )
    db.add(application)
    db.commit()
    db.refresh(application)

    return {
        "id": application.id, "job_listing_id": application.job_listing_id,
        "applicant_user_id": application.applicant_user_id,
        "status": application.status, "applied_at": str(application.applied_at),
    }
