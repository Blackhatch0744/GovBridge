from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.scheme import Scheme
from backend.models.document import Document
from backend.models.proposal import Proposal
from backend.agents.proposal_generator import generate_proposal
from backend.agents.impact_generator import generate_impact
from backend.schemas.application import ProposalRequest, ImpactRequest
from backend.routes.auth import get_current_user

router = APIRouter()


@router.post("/proposal")
def gen_proposal(body: ProposalRequest, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    scheme = db.query(Scheme).filter(Scheme.id == body.scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    doc_types = []
    if body.document_ids:
        docs = db.query(Document).filter(
            Document.id.in_(body.document_ids),
            Document.user_id == current_user.id,
        ).all()
        doc_types = [d.document_type for d in docs]

    scheme_data = {
        "id": scheme.id, "name": scheme.name, "ministry": scheme.ministry,
        "description": scheme.description,
        "funding_min": scheme.funding_min, "funding_max": scheme.funding_max,
    }
    user_data = {
        "id": current_user.id, "name": current_user.name,
        "entity_type": current_user.entity_type,
        "industry": current_user.industry or "",
        "location": current_user.location or "",
        "revenue": current_user.revenue or 0,
    }

    try:
        result = generate_proposal(scheme_data, user_data, doc_types)
    except Exception as e:
        if "RATE_LIMITED" in str(e):
            raise HTTPException(status_code=429, detail="Please wait 60 seconds before generating another proposal for this scheme")
        raise HTTPException(status_code=500, detail="Proposal generation failed")

    proposal = Proposal(
        user_id=current_user.id,
        scheme_id=scheme.id,
        proposal_text=result["proposal_text"],
        impact_statement="",
        compliance_score=0.0,
    )
    db.add(proposal)
    db.commit()
    db.refresh(proposal)

    return {
        "id": proposal.id,
        "proposal_text": result["proposal_text"],
        "sections": result["sections"],
        "scheme_id": scheme.id,
        "scheme_name": scheme.name,
    }


@router.post("/impact")
def gen_impact(body: ImpactRequest, current_user=Depends(get_current_user)):
    try:
        result = generate_impact(
            business_type=body.business_type,
            location=body.location,
            scheme_name=body.scheme_name,
            funding_amount=body.funding_amount,
        )
    except Exception as e:
        if "RATE_LIMITED" in str(e):
            raise HTTPException(status_code=429, detail="Please wait 60 seconds before generating another impact statement")
        raise HTTPException(status_code=500, detail="Impact generation failed")

    return result
