"""Normalize 'Aadhaar Card' -> 'Aadhaar' in all database tables."""
import json
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import SessionLocal, init_db
from backend.models.scheme import Scheme
from backend.models.user_compliance import UserCompliance

def migrate():
    init_db()
    db = SessionLocal()

    # Update schemes.required_documents
    schemes = db.query(Scheme).all()
    updated = 0
    for s in schemes:
        if s.required_documents:
            new_docs = [d.replace("Aadhaar Card", "Aadhaar") for d in s.required_documents]
            if new_docs != s.required_documents:
                s.required_documents = new_docs
                updated += 1
    print(f"Updated {updated} scheme(s)")

    # Update user_compliance.missing_documents and matching_documents
    comps = db.query(UserCompliance).all()
    comp_updated = 0
    for c in comps:
        changed = False
        if c.missing_documents:
            new_missing = [d.replace("Aadhaar Card", "Aadhaar") for d in c.missing_documents]
            if new_missing != c.missing_documents:
                c.missing_documents = new_missing
                changed = True
        if c.matching_documents:
            new_matching = [d.replace("Aadhaar Card", "Aadhaar") for d in c.matching_documents]
            if new_matching != c.matching_documents:
                c.matching_documents = new_matching
                changed = True
        if changed:
            comp_updated += 1
    print(f"Updated {comp_updated} compliance record(s)")

    db.commit()
    db.close()
    print("Migration complete!")

if __name__ == "__main__":
    migrate()
