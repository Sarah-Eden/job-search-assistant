from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import NoResultFound, SQLAlchemyError
from db.connection import get_engine
from db.repository import JobRepository
from job_agent.models import ApplicationUpdate, JobHeader, JobRecord, JobDetailView
from datetime import date
from typing import Optional, Literal
import logging

app = FastAPI()
engine = get_engine()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    filename="logs/job_agent.log",
    level=logging.ERROR,
    format="%(asctime)s %(levelname)s %(message)s",
)
logger = logging.getLogger(__name__)


def get_repository() -> JobRepository:
    return JobRepository(engine)


@app.exception_handler(NoResultFound)
async def not_found_handler(request: Request, exc: NoResultFound):
    logger.error(f"Item not found: {request.url.path} params={request.path_params}")
    return JSONResponse(status_code=404, content={"detail": "Item not found"})


@app.exception_handler(SQLAlchemyError)
async def db_error_handler(request: Request, exc: SQLAlchemyError):
    logger.error(f"DB error: {request.url.path} params={request.path_params}")
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


@app.get("/jobs")
def get_jobs(
    repo: JobRepository = Depends(get_repository),
    is_relevant: Optional[bool] = None,
    review_status: Optional[Literal["new", "accepted", "declined"]] = None,
    date_type: Optional[Literal["created_at", "pub_date", "expiry_date"]] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
) -> list[JobHeader]:

    return repo.get_jobs(
        is_relevant=is_relevant,
        review_status=review_status,
        date_type=date_type,
        start_date=start_date,
        end_date=end_date,
    )


@app.get("/jobs/{job_id}")
def get_job_details(
    job_id: int,
    repo: JobRepository = Depends(get_repository),
) -> JobDetailView:
    job, score, application = repo.get_job_details(id=job_id)
    return JobDetailView(job=job, score=score, application=application)


@app.patch("/jobs/{job_id}")
def update_job_status(
    job_id: int,
    review_status: Literal["accepted", "declined"],
    repo: JobRepository = Depends(get_repository),
):
    repo.update_job_status(id=job_id, review_status=review_status)


@app.post("/applications/{job_id}")
def create_application(job_id: int, repo: JobRepository = Depends(get_repository)):
    repo.create_application(job_id)


@app.patch("/applications/{application_id}")
def update_application(
    application_id: int,
    application_update: ApplicationUpdate,
    repo: JobRepository = Depends(get_repository),
):
    repo.update_application(
        application_id=application_id, application_update=application_update
    )
