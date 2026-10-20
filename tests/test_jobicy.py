import pytest
from sqlalchemy import select
from sqlalchemy.orm import Session
from job_agent import jobicy
from db.schema import JobApiParams


def test_update_jobicy_accepted_values(engine, monkeypatch):
    JobApiParams.__table__.create(engine)

    with Session(engine) as session:
        geo = JobApiParams(
            source="jobicy",
            param_name="geo",
            param_value=["usa"],
            accepted_values={"USA": "usa"},
        )
        industry = JobApiParams(
            source="jobicy",
            param_name="industry",
            param_value=["engineer"],
            accepted_values={"Software Engineer": "engineer"},
        )
        session.add_all([geo, industry])
        session.commit()

    monkeypatch.setattr(jobicy, "get_engine", lambda: engine)
    monkeypatch.setattr(
        jobicy,
        "get_industries",
        lambda: {"Software Engineering": "engineer", "DevOps": "admin"},
    )
    monkeypatch.setattr(
        jobicy, "get_locations", lambda: {"USA": "usa", "Canada": "canada"}
    )

    jobicy.update_accepted_values()

    with Session(engine) as session:
        loc = session.scalars(
            select(JobApiParams).where(
                JobApiParams.source == "jobicy", JobApiParams.param_name == "geo"
            )
        ).one()
        ind = session.scalars(
            select(JobApiParams).where(
                JobApiParams.source == "jobicy", JobApiParams.param_name == "industry"
            )
        ).one()

        assert ind.accepted_values == {
            "Software Engineering": "engineer",
            "DevOps": "admin",
        }
        assert loc.accepted_values == {"USA": "usa", "Canada": "canada"}
        assert loc.param_value == ["usa"]
        assert ind.param_value == ["engineer"]
