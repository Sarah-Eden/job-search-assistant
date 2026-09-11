from sqlalchemy import or_, select
from sqlalchemy.orm import Session
from db.schema import JobApiParams
from typing import Optional
import logging

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

    def get_search_keywords(self):
        with Session(self.engine) as session:
            stmt = select(JobApiParams).where(JobApiParams.source == "query")
