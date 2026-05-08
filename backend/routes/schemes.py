from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.scheme import Scheme
from backend.routes.auth import get_current_user

router = APIRouter()


@router.get("/")
def list_schemes(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    schemes = db.query(Scheme).all()
    return [
        {
            "id": s.id, "name": s.name, "ministry": s.ministry,
            "description": s.description, "target_entities": s.target_entities or [],
            "eligible_states": s.eligible_states or [],
            "industries": s.industries or [],
            "funding_min": s.funding_min, "funding_max": s.funding_max,
            "required_documents": s.required_documents or [],
            "deadline": s.deadline, "source_url": s.source_url,
            "tags": s.tags or [],
        }
        for s in schemes
    ]


@router.get("/{scheme_id}")
def get_scheme(scheme_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    scheme = db.query(Scheme).filter(Scheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return {
        "id": scheme.id, "name": scheme.name, "ministry": scheme.ministry,
        "description": scheme.description, "target_entities": scheme.target_entities or [],
        "eligible_states": scheme.eligible_states or [],
        "industries": scheme.industries or [],
        "funding_min": scheme.funding_min, "funding_max": scheme.funding_max,
        "required_documents": scheme.required_documents or [],
        "deadline": scheme.deadline, "source_url": scheme.source_url,
        "tags": scheme.tags or [],
    }
