from pydantic import BaseModel
from typing import Optional, List


class JobResponse(BaseModel):
    id: int
    business_user_id: int
    application_id: int
    role_title: str
    description: Optional[str] = None
    pay_min: int = 0
    pay_max: int = 0
    location: Optional[str] = None
    skills: List[str] = []
    status: str = "open"

    class Config:
        from_attributes = True


class JobApplyRequest(BaseModel):
    resume_url: Optional[str] = None
