from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, func
from backend.database import Base


class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    ministry = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    target_entities = Column(JSON, default=[])
    eligible_states = Column(JSON, default=[])
    industries = Column(JSON, default=[])
    funding_min = Column(Integer, default=0)
    funding_max = Column(Integer, default=0)
    required_documents = Column(JSON, default=[])
    deadline = Column(String)
    source_url = Column(String)
    tags = Column(JSON, default=[])
