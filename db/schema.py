from typing import Optional
from datetime import date, datetime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import (
    ForeignKey,
    Boolean,
    String,
    Integer,
    Float,
    Text,
    JSON,
    Date,
    DateTime,
    Enum,
    func,
    UniqueConstraint,
)


class Base(DeclarativeBase):
    pass


class Job(Base):
    __tablename__ = "job_postings"
    id: Mapped[int] = mapped_column(autoincrement=True, primary_key=True)
    title: Mapped[Optional[str]] = mapped_column(String(255))
    company_name: Mapped[Optional[str]] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    employment_type: Mapped[Optional[str]] = mapped_column(String(255))
    experience_level: Mapped[Optional[list]] = mapped_column(JSON)
    location: Mapped[Optional[list]] = mapped_column(JSON)
    categories: Mapped[Optional[list]] = mapped_column(JSON)
    pub_date: Mapped[Optional[date]] = mapped_column(Date)
    expiry_date: Mapped[Optional[date]] = mapped_column(Date)
    application_url: Mapped[str] = mapped_column(Text, unique=True)
    is_relevant: Mapped[Optional[bool]] = mapped_column(Boolean)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class Score(Base):
    __tablename__ = "job_scores"
    id: Mapped[int] = mapped_column(autoincrement=True, primary_key=True)
    job_id: Mapped[int] = mapped_column(ForeignKey("job_postings.id"))
    score: Mapped[float] = mapped_column(Float)
    score_details: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class Application(Base):
    __tablename__ = "applications"
    id: Mapped[int] = mapped_column(autoincrement=True, primary_key=True)
    job_id: Mapped[int] = mapped_column(ForeignKey("job_postings.id"))
    portal_available: Mapped[Optional[bool]] = mapped_column(Boolean)
    date_applied: Mapped[Optional[date]] = mapped_column(Date)
    status: Mapped[str] = mapped_column(
        Enum(
            "pending",
            "applied",
            "interviewing",
            "rejected",
            "withdrawn",
            name="application_status",
        ),
        nullable=False,
    )
    response_received: Mapped[bool] = mapped_column(Boolean, default=False)
    response_date: Mapped[Optional[date]] = mapped_column(Date)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime, onupdate=func.now()
    )


class CoverLetter(Base):
    __tablename__ = "cover_letters"
    id: Mapped[int] = mapped_column(autoincrement=True, primary_key=True)
    job_id: Mapped[int] = mapped_column(ForeignKey("job_postings.id"))
    letter_text: Mapped[str] = mapped_column(Text)
    version: Mapped[int] = mapped_column(Integer)
    ai_model: Mapped[str] = mapped_column(String(100))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class SearchQuery(Base):
    __tablename__ = "search_queries"
    id: Mapped[int] = mapped_column(autoincrement=True, primary_key=True)
    query_text: Mapped[str] = mapped_column(Text)
    source: Mapped[str] = mapped_column(String(255))
    parameters: Mapped[dict] = mapped_column(JSON)
    status: Mapped[str] = mapped_column(
        Enum("success", "error", "no_results", name="search_query_status")
    )
    jobs_found: Mapped[int] = mapped_column(Integer)
    num_relevant: Mapped[Optional[int]] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class JobSearchQuery(Base):
    __tablename__ = "job_search_queries"
    __table_args__ = (UniqueConstraint("job_id", "search_query_id"),)
    id: Mapped[int] = mapped_column(autoincrement=True, primary_key=True)
    job_id: Mapped[int] = mapped_column(ForeignKey("job_postings.id"), index=True)
    search_query_id: Mapped[int] = mapped_column(
        ForeignKey("search_queries.id"), index=True
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
