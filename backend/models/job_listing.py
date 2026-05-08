from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, func
from backend.database import Base


class JobListing(Base):
    __tablename__ = "job_listings"

    id = Column(Integer, primary_key=True, index=True)
    business_user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=False)
    role_title = Column(String, nullable=False)
    description = Column(Text)
    pay_min = Column(Integer, default=0)
    pay_max = Column(Integer, default=0)
    location = Column(String)
    skills = Column(JSON, default=[])
    status = Column(String, default="open", index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
