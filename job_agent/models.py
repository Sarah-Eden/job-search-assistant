from enum import Enum

from pydantic import BaseModel, Field, AliasChoices, ConfigDict, field_validator
from datetime import date, datetime
from bs4 import BeautifulSoup
from typing import NamedTuple


class JobPosting(BaseModel):
    title: str = Field(validation_alias="jobTitle")
    description: str = Field(validation_alias="jobDescription")
    company_name: str | None = Field(default=None, validation_alias="companyName")
    employment_type: str | None = Field(
        default=None, validation_alias=AliasChoices("employmentType", "jobType")
    )
    experience_level: list[str] | None = Field(
        default=None, validation_alias=AliasChoices("seniority", "jobLevel")
    )
    location: list[str] | None = Field(
        default=None, validation_alias=AliasChoices("locationRestrictions", "jobGeo")
    )
    categories: list[str] | None = Field(
        default=None, validation_alias=AliasChoices("parentCategories", "jobIndustry")
    )
    pub_date: date | None = Field(default=None, validation_alias="pubDate")
    expiry_date: date | None = Field(default=None, validation_alias="expiryDate")
    application_url: str = Field(
        validation_alias=AliasChoices("applicationLink", "url")
    )

    model_config = ConfigDict(validate_by_alias=True, validate_by_name=True)

    @field_validator("experience_level", "location", mode="before")
    @classmethod
    def ensure_list(cls, value):
        if value is None:
            return None
        if not isinstance(value, list):
            return [value]
        else:
            return value

    @field_validator("employment_type", mode="before")
    @classmethod
    def remove_list(cls, value):
        if value is None:
            return None
        if isinstance(value, list):
            return ", ".join(value)
        else:
            return value

    @field_validator("pub_date", "expiry_date", mode="before")
    @classmethod
    def convert_time(cls, value):
        if value is None:
            return None

        if isinstance(value, int):
            return datetime.fromtimestamp(value).date()
        else:
            return datetime.fromisoformat(value).date()

    @field_validator("description", "title", mode="before")
    @classmethod
    def remove_html(cls, text):
        return BeautifulSoup(text, "html.parser").get_text(separator=" ")


class JobRecord(BaseModel):
    id: int
    title: str
    description: str
    company_name: str | None = None
    employment_type: str | None = None
    experience_level: list[str] | None = None
    location: list[str] | None = None
    categories: list[str] | None = None
    expiry_date: date | None = None
    model_config = ConfigDict(validate_by_name=True, from_attributes=True)


class JobSearchResults(BaseModel):
    jobs: list[JobPosting]


class FetchResult(NamedTuple):
    source_name: str
    term: str
    params: dict
    results: JobSearchResults | list
    status: str


class JobProcessResult(Enum):
    CREATED_NEW_JOB = "created_new_job"
    DUPLICATE_IRRELEVANT = "duplicate_irrelevant"
    DUPLICATE_UNCHANGED = "duplicate_unchanged"
    DUPLICATE_REPOSTED = "duplicate_reposted"
    DUPLICATE_REPOSTED_APPLIED = "duplicate_reposted_applied"
    ERROR = "error"
