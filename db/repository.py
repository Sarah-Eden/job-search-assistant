from sqlalchemy import insert, null, or_, select, update
from sqlalchemy.exc import IntegrityError, NoResultFound, SQLAlchemyError
from sqlalchemy.orm import Session
from db.schema import (
    Job,
    Score,
    Application,
    SearchQuery,
    CoverLetter,
    JobSearchQuery,
)
from job_agent.models import JobPosting, JobRecord, JobProcessResult
from datetime import datetime, date, time
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class JobRepository:
    def __init__(self, engine):
        self.engine = engine

    def create_search_query(
        self, query: str, source: str, params: dict, status: str, num_jobs: int
    ):
        try:
            with Session(self.engine) as session:
                search_query = SearchQuery(
                    query_text=query,
                    source=source,
                    parameters=params,
                    status=status,
                    jobs_found=num_jobs,
                )
                session.add(search_query)
                session.commit()
                return search_query.id

        except Exception as e:
            logger.error(f"Unexpected error creating new search query: {e}")
            raise

    def process_job_posting(self, job_posting: JobPosting, search_query_id: int):

        try:
            with Session(self.engine) as session:
                stmt = select(Job).where(
                    Job.application_url == job_posting.application_url
                )
                job_record = session.scalars(stmt).first()

                # No match found
                if job_record is None:
                    job = Job(**job_posting.model_dump())
                    session.add(job)
                    session.flush()

                    job_search_query = JobSearchQuery(
                        job_id=job.id, search_query_id=search_query_id
                    )
                    session.add(job_search_query)
                    session.commit()
                    return JobProcessResult.CREATED_NEW_JOB

                else:
                    job_search_query = JobSearchQuery(
                        job_id=job_record.id, search_query_id=search_query_id
                    )
                    session.add(job_search_query)
                    session.commit()

                    # Job record not relevant
                    if job_record.is_relevant == False:
                        return JobProcessResult.DUPLICATE_IRRELEVANT

                    else:
                        # Check if job dates changed
                        if (
                            job_record.pub_date == job_posting.pub_date
                            and job_record.expiry_date == job_posting.expiry_date
                        ):
                            return JobProcessResult.DUPLICATE_UNCHANGED
                        else:
                            stmt = select(Application).where(
                                Application.job_id == job_record.id
                            )
                            applied = session.scalars(stmt).first()
                            if applied is not None:
                                logger.warning(f"Job Reposted: {job_posting}")
                                return JobProcessResult.DUPLICATE_REPOSTED_APPLIED
                            else:
                                return JobProcessResult.DUPLICATE_REPOSTED

        except IntegrityError:
            session.rollback()
            logger.error(
                f"Unexpected integrity error for {job_posting.application_url}"
            )
            return JobProcessResult.ERROR

    def get_unscored_jobs(self):
        with Session(self.engine) as session:
            stmt = select(Job).where(
                Job.is_relevant.is_(None),
                or_(Job.expiry_date >= date.today(), Job.expiry_date.is_(None)),
            )
            return [JobRecord.model_validate(job) for job in session.scalars(stmt)]

    def save_score_results(
        self, job_record: JobRecord, is_relevant: bool, score: float, score_details: str
    ):
        try:
            with Session(self.engine) as session:
                stmt = select(Job).where(Job.id == job_record.id)
                record = session.scalars(stmt).one()
                record.is_relevant = is_relevant

                if not is_relevant:
                    record.review_status = "declined"

                new_score = Score(
                    job_id=job_record.id, score=score, score_details=score_details
                )
                session.add(new_score)
                session.commit()

        except SQLAlchemyError as e:
            logger.error(
                f"Error occurred when saving new score for job id: {job_record.id} {e}"
            )
            raise

    def get_jobs(
        self,
        is_relevant: Optional[bool],
        review_status: Optional[str],
        date_type: Optional[str],
        start_date: Optional[date],
        end_date: Optional[date],
    ):
        with Session(self.engine) as session:
            terms = []
            if is_relevant is not None:
                terms.append(Job.is_relevant == is_relevant)
            if review_status is not None:
                terms.append(Job.review_status == review_status)
            if date_type is not None:
                col = getattr(Job, date_type)
                if start_date is not None:
                    start = (
                        datetime.combine(start_date, time.min)
                        if date_type == "created_at"
                        else start_date
                    )
                    terms.append(col >= start)
                if end_date is not None:
                    end = (
                        datetime.combine(end_date, time(23, 59))
                        if date_type == "created_at"
                        else end_date
                    )
                    terms.append(col <= end)
            stmt = select(Job).where(*terms)
            return list(session.scalars(stmt))

    def get_job_by_id(self, id: int):
        with Session(self.engine) as session:
            stmt = select(Job).where(Job.id == id)
            return session.scalar(stmt)
