from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.user_match import UserMatch
from backend.models.user_compliance import UserCompliance
from backend.models.scheme import Scheme
from backend.routes.auth import get_current_user

router = APIRouter()


@router.get("/summary")
def get_dashboard_summary(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    matches = db.query(UserMatch).filter(UserMatch.user_id == current_user.id).all()
    compliances = db.query(UserCompliance).filter(UserCompliance.user_id == current_user.id).all()

    compliance_map = {c.scheme_id: c for c in compliances}

    top_matches = []
    for m in matches:
        scheme = db.query(Scheme).filter(Scheme.id == m.scheme_id).first()
        comp = compliance_map.get(m.scheme_id)
        top_matches.append({
            "scheme_id": m.scheme_id,
            "scheme_name": scheme.name if scheme else "",
            "eligibility_score": m.eligibility_score,
            "reasoning": m.reasoning,
            "readiness_score": comp.readiness_score if comp else 0,
            "missing_documents": comp.missing_documents if comp else [],
        })

    top_matches.sort(key=lambda x: x["eligibility_score"], reverse=True)

    scores = [m.eligibility_score for m in matches]
    avg_eligibility = round(sum(scores) / len(scores), 1) if scores else 0

    all_missing = []
    for c in compliances:
        for doc in (c.missing_documents or []):
            if doc not in all_missing:
                all_missing.append(doc)

    total_schemes = db.query(Scheme).count()

    return {
        "top_matches": top_matches,
        "total_schemes": total_schemes,
        "avg_eligibility": avg_eligibility,
        "critical_gaps": all_missing,
    }
