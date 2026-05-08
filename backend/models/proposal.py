from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, func
from backend.database import Base


class Proposal(Base):
    __tablename__ = "proposals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    scheme_id = Column(Integer, ForeignKey("schemes.id"), nullable=False, index=True)
    proposal_text = Column(Text, nullable=False)
    impact_statement = Column(Text)
    compliance_score = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
