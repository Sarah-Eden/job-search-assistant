from sqlalchemy import text
from threading import Thread
import requests
import httpx
from tests.support import HarnessViolation
import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

app = FastAPI()


def test_engine_works_from_second_thread(engine):
    results = []

    with engine.connect() as conn:
        conn.execute(text("CREATE TABLE test (value INTEGER)"))
        conn.execute(text("INSERT INTO test (value) VALUES (42)"))
        conn.commit()

    def use_engine():
        with engine.connect() as conn:
            value = conn.execute(text("SELECT value FROM test")).scalar_one()
            results.append(value)

    thread = Thread(target=use_engine)
    thread.start()
    thread.join()
    assert results[0] == 42


def test_requests_are_blocked():
    with pytest.raises(HarnessViolation):
        requests.get("https://example.com")


def test_httpx_are_blocked():
    with pytest.raises(HarnessViolation):
        httpx.get("https://example.com")


def test_harness_violation():
    with pytest.raises(HarnessViolation):
        try:
            requests.get("https://example.com")
        except Exception:
            pytest.fail("HarnessViolation was caught by Exception")


@app.get("/ping")
def ping():
    return {"ok": True}


def test_fastapi():
    client = TestClient(app)
    response = client.get("/ping")
    assert response.status_code == 200
    assert response.json() == {"ok": True}
