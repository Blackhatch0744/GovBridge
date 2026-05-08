from sqlalchemy import Column, Integer, String, DateTime, func
from backend.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    entity_type = Column(String, nullable=False)
    location = Column(String)
    industry = Column(String)
    revenue = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
