import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select
from routes import app, get_settings_repository
from db.settings_repo import SettingsRepository
from db.schema import JobApiParams, Base
from sqlalchemy.orm import Session


@pytest.fixture
def settings_db(engine):
    Base.metadata.create_all(engine, tables=[JobApiParams.__table__])
    country = JobApiParams(
        source="himalayas",
        param_name="country",
        param_value=["US"],
        accepted_values=None,
    )
    seniority = JobApiParams(
        source="himalayas",
        param_name="seniority",
        param_value=None,
        accepted_values=[
            "Entry-level",
            "Mid-level",
            "Senior",
            "Manager",
            "Director",
            "Executive",
        ],
    )

    with Session(engine) as session:
        session.add_all([country, seniority])
        session.commit()

    return engine


@pytest.fixture
def client(settings_db):
    def get_test_settings_repository():
        return SettingsRepository(settings_db)

    app.dependency_overrides[get_settings_repository] = get_test_settings_repository

    try:
        with TestClient(app) as test_client:
            yield test_client
    finally:
        app.dependency_overrides.pop(get_settings_repository, None)


def test_update_search_params_success(client, settings_db):
    response = client.patch(
        "/settings/search_params/himalayas",
        json={"country": ["CA"], "seniority": ["Entry-level"]},
    )
    assert response.status_code == 200

    with Session(settings_db) as session:
        stmt = select(JobApiParams).where(JobApiParams.source == "himalayas")
        app = list(session.scalars(stmt))
        records = {record.param_name: record for record in app}

        assert records["country"].param_value == ["CA"]
        assert records["seniority"].param_value == ["Entry-level"]


def test_update_search_params_invalid(client, settings_db):
    response = client.patch(
        "/settings/search_params/himalayas", json={"country": ["CA"], "geo": ["US"]}
    )
    assert response.status_code == 400

    with Session(settings_db) as session:
        stmt = select(JobApiParams).where(JobApiParams.source == "himalayas")
        app = list(session.scalars(stmt))
        records = {record.param_name: record for record in app}

        assert records["country"].param_value == ["US"]
