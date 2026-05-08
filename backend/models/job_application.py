from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from backend.database import Base


class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)
    job_listing_id = Column(Integer, ForeignKey("job_listings.id"), nullable=False, index=True)
    applicant_user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    resume_url = Column(String)
    status = Column(String, default="applied", index=True)
    applied_at = Column(DateTime(timezone=True), server_default=func.now())
