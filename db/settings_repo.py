from sqlalchemy import select
from sqlalchemy.orm import Session
from db.schema import JobApiParams
import logging

from job_agent.models import JobSearchParamsUpdate

logger = logging.getLogger(__name__)


class SettingsRepository:
    def __init__(self, engine):
        self.engine = engine

    def get_all_search_params(self):
        with Session(self.engine) as session:
            stmt = select(JobApiParams)
            return list(session.scalars(stmt))

    def get_active_search_params(self, source):
        with Session(self.engine) as session:
            stmt = select(JobApiParams).where(
                JobApiParams.source == source, JobApiParams.param_value.is_not(None)
            )
            return list(session.scalars(stmt))

    def update_search_params(self, source, params_update: JobSearchParamsUpdate):
        with Session(self.engine) as session:
            stmt = select(JobApiParams).where(JobApiParams.source == source)
            app = list(session.scalars(stmt))
            records = {record.param_name: record for record in app}

            for field in params_update.model_dump():
                if field not in records:
                    raise ValueError(f"Row not found for {source}, {field}")

            for field, value in params_update.model_dump().items():
                records[field].param_value = value

            session.commit()

    def update_accepted_values(self, source, param_name, accepted_values):
        with Session(self.engine) as session:
            stmt = select(JobApiParams).where(
                JobApiParams.source == source, JobApiParams.param_name == param_name
            )
            app = session.scalars(stmt).one()
            app.accepted_values = accepted_values
            session.commit()
