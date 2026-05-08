import time
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.scheme import Scheme
from backend.models.user_match import UserMatch
from backend.models.user_compliance import UserCompliance
from backend.agents.scheme_matcher import match_schemes
from backend.agents.compliance_checker import check_compliance
from backend.schemas.scheme import MatchRequest
from backend.routes.auth import get_current_user

router = APIRouter()
_call_timestamps = {}


@router.post("/match")
def run_match(body: MatchRequest, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    user_id = current_user.id

    now = time.time()
    if user_id in _call_timestamps and (now - _call_timestamps[user_id]) < 30:
        existing = db.query(UserMatch).filter(UserMatch.user_id == user_id).all()
        if existing:
            return [
                {
                    "scheme_id": m.scheme_id, "eligibility_score": m.eligibility_score,
                    "reasoning": m.reasoning,
                    "scheme_name": db.query(Scheme).filter(Scheme.id == m.scheme_id).first().name
                    if db.query(Scheme).filter(Scheme.id == m.scheme_id).first() else "",
                }
                for m in existing
            ]
        raise HTTPException(status_code=429, detail="Please wait 30 seconds between match requests")

    existing = db.query(UserMatch).filter(UserMatch.user_id == user_id).all()
    if existing:
        return [
            {
                "scheme_id": m.scheme_id, "eligibility_score": m.eligibility_score,
                "reasoning": m.reasoning,
                "scheme_name": db.query(Scheme).filter(Scheme.id == m.scheme_id).first().name
                if db.query(Scheme).filter(Scheme.id == m.scheme_id).first() else "",
            }
            for m in existing
        ]

    _call_timestamps[user_id] = now

    schemes = db.query(Scheme).all()
    if not schemes:
        raise HTTPException(status_code=404, detail="No schemes in database")

    schemes_data = [
        {
            "id": s.id, "name": s.name, "ministry": s.ministry,
            "description": s.description, "target_entities": s.target_entities or [],
            "eligible_states": s.eligible_states or [],
            "industries": s.industries or [],
            "funding_min": s.funding_min, "funding_max": s.funding_max,
        }
        for s in schemes
    ]

    results = match_schemes(
        entity_type=body.entity_type,
        location=body.location,
        industry=body.industry,
        revenue=body.revenue,
        schemes_data=schemes_data,
    )

    db.query(UserMatch).filter(UserMatch.user_id == user_id).delete()
    db.query(UserCompliance).filter(UserCompliance.user_id == user_id).delete()

    top5 = results[:5]
    for r in top5:
        db.add(UserMatch(
            user_id=user_id,
            scheme_id=r["scheme_id"],
            eligibility_score=r["eligibility_score"],
            reasoning=r["reasoning"],
        ))
        scheme = db.query(Scheme).filter(Scheme.id == r["scheme_id"]).first()
        if scheme:
            comp = check_compliance(scheme.required_documents or [], [])
            db.add(UserCompliance(
                user_id=user_id,
                scheme_id=r["scheme_id"],
                readiness_score=comp["readiness_score"],
                missing_documents=comp["missing_documents"],
                matching_documents=comp["matching_documents"],
            ))
    db.commit()

    return top5
