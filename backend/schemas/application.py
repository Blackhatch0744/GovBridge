from pydantic import BaseModel
from typing import Optional, List


class ApplicationCreate(BaseModel):
    scheme_id: int
    proposal_id: Optional[int] = None


class ApplicationUpdate(BaseModel):
    status: str


class ApplicationResponse(BaseModel):
    id: int
    user_id: int
    scheme_id: int
    proposal_id: Optional[int] = None
    status: str
    submitted_at: Optional[str] = None
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True


class ProposalRequest(BaseModel):
    scheme_id: int
    document_ids: List[int] = []


class ImpactRequest(BaseModel):
    business_type: str
    location: str
    scheme_name: str
    funding_amount: int
