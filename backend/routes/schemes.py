from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.scheme import Scheme
from backend.routes.auth import get_current_user
from backend.config.gemini import call_gemini_with_fallback

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

@router.get("/analyze/{scheme_id}")
def analyze_scheme(scheme_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    scheme = db.query(Scheme).filter(Scheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
        
    prompt = f"""You are a government grant analyst. Briefly analyze the suitability of this scheme for the following applicant in 2-3 sentences.
    
    Applicant: {current_user.name}, Entity: {current_user.entity_type}, Industry: {current_user.industry}, Location: {current_user.location}, Revenue: {current_user.revenue}
    Scheme: {scheme.name} - {scheme.description}
    
    Provide ONLY the brief analysis text. Do not use markdown. Do not include introductory text."""
    
    try:
        analysis = call_gemini_with_fallback(prompt)
    except Exception:
        analysis = f"Based on your profile as a {current_user.entity_type} in the {current_user.industry} sector in {current_user.location}, this scheme could provide valuable funding up to ₹{scheme.funding_max}. Ensure you meet all document requirements to maximize your eligibility."
        
    return {"analysis": analysis}
