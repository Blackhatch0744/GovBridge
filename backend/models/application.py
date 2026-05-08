from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from backend.database import Base


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    scheme_id = Column(Integer, ForeignKey("schemes.id"), nullable=False, index=True)
    proposal_id = Column(Integer, ForeignKey("proposals.id"), nullable=True)
    status = Column(String, default="draft", index=True)
    submitted_at = Column(DateTime(timezone=True))
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
