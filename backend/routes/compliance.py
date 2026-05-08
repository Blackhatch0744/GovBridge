from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.scheme import Scheme
from backend.models.user_compliance import UserCompliance
from backend.agents.compliance_checker import check_compliance
from backend.schemas.scheme import ComplianceRequest
from backend.routes.auth import get_current_user

router = APIRouter()


@router.post("/compliance")
def run_compliance(body: ComplianceRequest, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    scheme = db.query(Scheme).filter(Scheme.id == body.scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    result = check_compliance(
        required_documents=scheme.required_documents or [],
        uploaded_document_types=body.uploaded_document_types,
    )

    existing = db.query(UserCompliance).filter(
        UserCompliance.user_id == current_user.id,
        UserCompliance.scheme_id == body.scheme_id,
    ).first()

    if existing:
        existing.readiness_score = result["readiness_score"]
        existing.missing_documents = result["missing_documents"]
        existing.matching_documents = result["matching_documents"]
    else:
        db.add(UserCompliance(
            user_id=current_user.id,
            scheme_id=body.scheme_id,
            readiness_score=result["readiness_score"],
            missing_documents=result["missing_documents"],
            matching_documents=result["matching_documents"],
        ))

    db.commit()
    return result
