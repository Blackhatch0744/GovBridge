from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from backend.database import get_db
from backend.models.document import Document
from backend.models.user_compliance import UserCompliance
from backend.routes.auth import get_current_user

router = APIRouter()


@router.get("/")
def list_documents(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    docs = db.query(Document).filter(Document.user_id == current_user.id).all()
    return [
        {
            "id": d.id, "user_id": d.user_id, "file_url": d.file_url,
            "document_type": d.document_type, "uploaded_at": str(d.uploaded_at),
        }
        for d in docs
    ]


def _recalculate_compliance(db: Session, current_user):
    from backend.models.user_match import UserMatch
    from backend.models.scheme import Scheme
    from backend.agents.compliance_checker import check_compliance

    # Delete stale compliance data so it gets recalculated
    db.query(UserCompliance).filter(UserCompliance.user_id == current_user.id).delete()

    # Fetch user's currently uploaded document types
    user_docs = db.query(Document).filter(Document.user_id == current_user.id).all()
    uploaded_types = [d.document_type for d in user_docs]

    # Recalculate compliance for all existing matches
    matches = db.query(UserMatch).filter(UserMatch.user_id == current_user.id).all()
    for m in matches:
        scheme = db.query(Scheme).filter(Scheme.id == m.scheme_id).first()
        if scheme:
            comp = check_compliance(scheme.required_documents or [], uploaded_types)
            db.add(UserCompliance(
                user_id=current_user.id,
                scheme_id=m.scheme_id,
                readiness_score=comp["readiness_score"],
                missing_documents=comp["missing_documents"],
                matching_documents=comp["matching_documents"],
            ))
    db.commit()

class SetDocTypesRequest(BaseModel):
    document_types: List[str]


@router.post("/set-types")
def set_document_types(body: SetDocTypesRequest, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """Replace all user document types and recalculate compliance."""
    # Delete existing documents for user
    db.query(Document).filter(Document.user_id == current_user.id).delete()

    # Create new document entries
    new_docs = []
    for doc_type in body.document_types:
        doc = Document(
            user_id=current_user.id,
            file_url=f"/self-declared/{current_user.id}/{doc_type}",
            document_type=doc_type,
        )
        db.add(doc)
        new_docs.append(doc_type)

    db.commit()
    _recalculate_compliance(db, current_user)
    return {"document_types": new_docs, "count": len(new_docs)}


@router.post("/upload")
async def upload_document(
    document_type: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    file_url = f"/uploads/{current_user.id}/{file.filename}"

    try:
        from backend.config.settings import SUPABASE_URL, SUPABASE_KEY
        if SUPABASE_URL and SUPABASE_KEY:
            from supabase import create_client
            supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
            contents = await file.read()
            path = f"documents/{current_user.id}/{file.filename}"
            supabase.storage.from_("documents").upload(path, contents)
            file_url = f"{SUPABASE_URL}/storage/v1/object/public/documents/{path}"
    except Exception:
        pass

    doc = Document(
        user_id=current_user.id,
        file_url=file_url,
        document_type=document_type,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    
    _recalculate_compliance(db, current_user)

    return {
        "id": doc.id, "user_id": doc.user_id, "file_url": doc.file_url,
        "document_type": doc.document_type, "uploaded_at": str(doc.uploaded_at),
    }


@router.delete("/{doc_id}")
def delete_document(doc_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    doc = db.query(Document).filter(Document.id == doc_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    db.delete(doc)
    db.commit()

    _recalculate_compliance(db, current_user)

    return {"detail": "Document deleted"}

