from pydantic import (
    BaseModel,
    ConfigDict,
    RootModel,
)
from datetime import date, datetime
from bs4 import BeautifulSoup
from typing import Literal


class JobPosting(BaseModel):
    title: str
    source: str
    source_job_id: str
    description: str
    company_name: str | None = None
    employment_type: str | None = None
    experience_level: list[str] | None = None
    location: list[str] | None = None
    categories: list[str] | None = None
    pub_date: date | None = None
    expiry_date: date | None = None
    application_url: str


class JobRecord(BaseModel):
    id: int
    title: str
    description: str
    company_name: str | None = None
    employment_type: str | None = None
    experience_level: list[str] | None = None
    location: list[str] | None = None
    categories: list[str] | None = None
    pub_date: date | None = None
    expiry_date: date | None = None
    created_at: datetime
    is_relevant: bool | None = None
    review_status: Literal["new", "accepted", "declined"]
    application_url: str
    model_config = ConfigDict(validate_by_name=True, from_attributes=True)


class JobHeader(BaseModel):
    id: int
    title: str
    company_name: str | None = None
    review_status: Literal["new", "accepted", "declined"]


class ScoreRecord(BaseModel):
    id: int
    score: float
    score_details: str
    model_config = ConfigDict(validate_by_name=True, from_attributes=True)


class ApplicationRecord(BaseModel):
    id: int
    portal_available: bool | None
    date_applied: date | None = None
    status: Literal["pending", "applied", "interviewing", "rejected", "withdrawn"]
    response_received: bool | None
    response_date: date | None = None
    model_config = ConfigDict(validate_by_name=True, from_attributes=True)


class ApplicationUpdate(BaseModel):
    portal_available: bool | None = None
    date_applied: date | None = None
    status: (
        Literal["pending", "applied", "interviewing", "rejected", "withdrawn"] | None
    ) = None
    response_received: bool | None = None
    response_date: date | None = None
    model_config = ConfigDict(validate_by_name=True, from_attributes=True)


class JobDetailView(BaseModel):
    job: JobRecord
    score: ScoreRecord | None = None
    application: ApplicationRecord | None = None


class JobSearchParams(BaseModel):
    source: str
    param_name: str
    param_value: list | None = None
    accepted_values: dict[str, str] | None = None
    model_config = ConfigDict(validate_by_name=True, from_attributes=True)


class JobSearchParamsUpdate(RootModel[dict[str, list[str] | None]]):
    pass
