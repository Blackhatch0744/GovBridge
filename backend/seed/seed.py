import json
from pathlib import Path
import bcrypt
from backend.database import engine, SessionLocal, Base
from backend.models.user import User
from backend.models.scheme import Scheme
from backend.models.user_match import UserMatch
from backend.models.user_compliance import UserCompliance
from backend.agents.scheme_matcher import match_schemes
from backend.agents.compliance_checker import check_compliance


def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def run_seed():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("Tables recreated.")

    db = SessionLocal()

    seed_file = Path(__file__).parent / "schemes.json"
    with open(seed_file, "r") as f:
        schemes_data = json.load(f)

    for data in schemes_data:
        db.add(Scheme(**data))
    db.commit()
    print(f"Seeded {len(schemes_data)} schemes.")

    user1 = User(
        name="Priya Sharma",
        email="priya@kumarfoods.in",
        password_hash=hash_password("password123"),
        entity_type="msme",
        location="Chennai",
        industry="food",
        revenue=500000,
    )
    user2 = User(
        name="Arjun Mehta",
        email="arjun@techstart.io",
        password_hash=hash_password("password123"),
        entity_type="startup",
        location="Bangalore",
        industry="tech",
        revenue=1200000,
    )
    db.add_all([user1, user2])
    db.commit()
    db.refresh(user1)
    db.refresh(user2)
    print(f"Created users: {user1.name} (id={user1.id}), {user2.name} (id={user2.id})")

    all_schemes = db.query(Scheme).all()
    schemes_list = [
        {
            "id": s.id, "name": s.name, "ministry": s.ministry,
            "description": s.description, "target_entities": s.target_entities or [],
            "eligible_states": s.eligible_states or [],
            "industries": s.industries or [],
            "funding_min": s.funding_min, "funding_max": s.funding_max,
            "required_documents": s.required_documents or [],
        }
        for s in all_schemes
    ]

    for user in [user1, user2]:
        print(f"\nMatching schemes for {user.name}...")
        results = match_schemes(
            entity_type=user.entity_type,
            location=user.location or "",
            industry=user.industry or "",
            revenue=user.revenue or 0,
            schemes_data=schemes_list,
        )

        top5 = results[:5]
        for r in top5:
            db.add(UserMatch(
                user_id=user.id,
                scheme_id=r["scheme_id"],
                eligibility_score=r["eligibility_score"],
                reasoning=r["reasoning"],
            ))

            scheme = db.query(Scheme).filter(Scheme.id == r["scheme_id"]).first()
            if scheme:
                comp = check_compliance(scheme.required_documents or [], [])
                db.add(UserCompliance(
                    user_id=user.id,
                    scheme_id=r["scheme_id"],
                    readiness_score=comp["readiness_score"],
                    missing_documents=comp["missing_documents"],
                    matching_documents=comp["matching_documents"],
                ))

        db.commit()
        print(f"  Stored {len(top5)} matches + compliance for {user.name}")

    db.close()
    print("\nSeed complete.")


if __name__ == "__main__":
    run_seed()
