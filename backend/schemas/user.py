from pydantic import BaseModel
from typing import Optional


class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    entity_type: str
    location: Optional[str] = None
    industry: Optional[str] = None
    revenue: Optional[int] = 0


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    entity_type: str
    location: Optional[str] = None
    industry: Optional[str] = None
    revenue: int = 0

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
