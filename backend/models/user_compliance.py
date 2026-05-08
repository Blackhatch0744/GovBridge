from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, JSON, func
from backend.database import Base


class UserCompliance(Base):
    __tablename__ = "user_compliance"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    scheme_id = Column(Integer, ForeignKey("schemes.id"), nullable=False, index=True)
    readiness_score = Column(Float, default=0.0)
    missing_documents = Column(JSON, default=[])
    matching_documents = Column(JSON, default=[])
    created_at = Column(DateTime(timezone=True), server_default=func.now())
