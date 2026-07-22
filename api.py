from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from db.connection import get_engine
from db.repository import JobRepository, JobRecord
from datetime import datetime, date
from typing import Optional, Literal

app = FastAPI()
engine = get_engine()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_repository() -> JobRepository:
    return JobRepository(engine)


@app.get("/jobs")
def get_jobs(
    repo: JobRepository = Depends(get_repository),
    is_relevant: Optional[bool] = None,
    review_status: Optional[Literal["new", "accepted", "declined"]] = None,
    date_type: Optional[Literal["created_at", "pub_date", "expiry_date"]] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
) -> list[JobRecord]:

    return repo.get_jobs(
        is_relevant=is_relevant,
        review_status=review_status,
        date_type=date_type,
        start_date=start_date,
        end_date=end_date,
    )
