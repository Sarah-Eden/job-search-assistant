import pytest
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
import requests
import httpx
from tests.support import HarnessViolation


def block_request(*args, **kwargs):
    raise HarnessViolation


@pytest.fixture(autouse=True)
def block_network(monkeypatch):
    monkeypatch.setattr(requests.adapters.HTTPAdapter, "send", block_request)
    monkeypatch.setattr(httpx.HTTPTransport, "handle_request", block_request)


@pytest.fixture
def engine():
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    return engine
