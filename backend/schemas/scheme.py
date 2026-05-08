from pydantic import BaseModel
from typing import Optional, List


class SchemeResponse(BaseModel):
    id: int
    name: str
    ministry: str
    description: str
    target_entities: List[str] = []
    eligible_states: List[str] = []
    industries: List[str] = []
    funding_min: int = 0
    funding_max: int = 0
    required_documents: List[str] = []
    deadline: Optional[str] = None
    source_url: Optional[str] = None
    tags: List[str] = []

    class Config:
        from_attributes = True


class MatchRequest(BaseModel):
    entity_type: str
    location: str
    industry: str
    revenue: int = 0


class ComplianceRequest(BaseModel):
    scheme_id: int
    uploaded_document_types: List[str] = []
