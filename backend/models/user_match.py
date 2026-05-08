from sqlalchemy import Column, Integer, Float, String, Text, DateTime, ForeignKey, func
from backend.database import Base


class UserMatch(Base):
    __tablename__ = "user_matches"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    scheme_id = Column(Integer, ForeignKey("schemes.id"), nullable=False, index=True)
    eligibility_score = Column(Float, default=0.0)
    reasoning = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
