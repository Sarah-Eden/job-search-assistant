from pydantic import BaseModel
from datetime import date


class Job(BaseModel):
    title: str
    company_name: str
    employment_type: str | None = None
    experience_level: str | None = None
    description: str
    categories: list[str] | None = None
    pub_date: date | None = None
    application_url: str
    source: str
