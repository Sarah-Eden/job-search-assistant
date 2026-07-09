from sqlalchemy import insert, null, or_, select, update
from sqlalchemy.exc import IntegrityError, NoResultFound, SQLAlchemyError
from sqlalchemy.orm import Session
from job_agent.db.schema import Job, Score, Application, SearchQuery, CoverLetter
from job_agent.models import JobPosting, JobRecord
from datetime import date
import logging

logger = logging.getLogger(__name__)


class JobRepository:
    def __init__(self, engine):
        self.engine = engine

    def create_job_posting(
        self, job_posting: JobPosting, source: str, search_query: str
    ):

        try:
            with Session(self.engine) as session:
                stmt = select(Job).where(
                    Job.application_url == job_posting.application_url
                )
                job_record = session.scalars(stmt).first()
                # No match found, create new record
                if job_record is None:
                    job = Job(
                        **job_posting.model_dump(),
                        source=source,
                        search_query=search_query,
                    )
                    session.add(job)
                    session.commit()
                    return True
                else:
                    # Check if job is relevant
                    if job_record.is_relevant == False:
                        return False
                    else:
                        # Check if job dates changed
                        if (
                            job_record.pub_date == job_posting.pub_date
                            and job_record.expiry_date == job_posting.expiry_date
                        ):
                            return False
                        else:
                            stmt = select(Application).where(
                                Application.job_id == job_record.id
                            )
                            applied = session.scalars(stmt).first()
                            if applied is not None:
                                logger.warning(f"Job Reposted: {job_posting}")
                                return "applied_job_reposted"
                            else:
                                return False

        except IntegrityError:
            session.rollback()
            logger.error(
                f"Unexpected integrity error for {job_posting.application_url}"
            )
            return False

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
