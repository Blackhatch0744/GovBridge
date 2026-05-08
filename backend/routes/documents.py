from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.document import Document
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

    return {
        "id": doc.id, "user_id": doc.user_id, "file_url": doc.file_url,
        "document_type": doc.document_type, "uploaded_at": str(doc.uploaded_at),
    }
