"""Normalize 'Udyam Certificate' -> 'Udyam Registration' in all database tables."""
import json
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import SessionLocal, init_db
from backend.models.document import Document
from backend.models.user_compliance import UserCompliance

def migrate():
    init_db()
    db = SessionLocal()

    # Update Document table
    docs = db.query(Document).filter(Document.document_type == "Udyam Certificate").all()
    updated_docs = 0
    for d in docs:
        d.document_type = "Udyam Registration"
        # also update file_url if it contains the string
        d.file_url = d.file_url.replace("Udyam Certificate", "Udyam Registration")
        updated_docs += 1
    print(f"Updated {updated_docs} document record(s)")

    # Update UserCompliance table
    comps = db.query(UserCompliance).all()
    comp_updated = 0
    for c in comps:
        changed = False
        if c.missing_documents:
            new_missing = [d.replace("Udyam Certificate", "Udyam Registration") for d in c.missing_documents]
            if new_missing != c.missing_documents:
                c.missing_documents = new_missing
                changed = True
        if c.matching_documents:
            new_matching = [d.replace("Udyam Certificate", "Udyam Registration") for d in c.matching_documents]
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
