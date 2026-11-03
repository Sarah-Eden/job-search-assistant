import pytest
from db.schema import JobApiParams
from job_agent.himalayas import build_search_params, get_himalayas_jobs
import httpx
from unittest.mock import patch


def test_build_search_params():

    terms = JobApiParams(
        source="query",
        param_name="search_terms",
        param_value=["software engineer", "Python developer"],
        accepted_values=None,
    )

    params = [
        JobApiParams(
            source="himalayas",
            param_name="timezone",
            param_value=["UTC+", "UTC-"],
            accepted_values=None,
        ),
        JobApiParams(
            source="himalayas",
            param_name="seniority",
            param_value=["Entry-level", "Mid-level"],
            accepted_values=None,
        ),
        JobApiParams(
            source="himalayas",
            param_name="sort",
            param_value=["recent"],
            accepted_values=None,
        ),
        JobApiParams(
            source="himalayas",
            param_name="retrieval_limit",
            param_value=["100"],
            accepted_values=None,
        ),
    ]
    search_params, limit = build_search_params(terms, params)
    assert len(search_params) == 4
    assert limit == 100

    expected_combinations = {
        ("software engineer", "UTC+"),
        ("software engineer", "UTC-"),
        ("Python developer", "UTC+"),
        ("Python developer", "UTC-"),
    }

    actual_combinations = {(item["q"], item["timezone"]) for item in search_params}

    assert actual_combinations == expected_combinations
    assert all(item["seniority"] == "Entry-level,Mid-level" for item in search_params)
    assert all(item["sort"] == "recent" for item in search_params)
    assert all("retrieval_limit" not in item for item in search_params)


def test_himalayas_pagination():
    requested_pages = []

    def mock_response(request):
        page = int(request.url.params["page"])
        requested_pages.append(page)

        jobs = [{"guid": "test-job"}] * 20

        return httpx.Response(
            200,
            json={"jobs": jobs, "totalCount": 100},
        )

    transport = httpx.MockTransport(mock_response)

    real_client = httpx.Client

    with patch(
        "job_agent.himalayas.httpx.Client",
        side_effect=lambda: real_client(transport=transport),
    ):
        results = get_himalayas_jobs([{"q": "python developer"}], 25)

    assert requested_pages == [1, 2]
    assert len(results) == 1
    assert len(results[0]["jobs"]) == 25
    assert results[0]["outcome"] == "success"
    assert results[0]["total_jobs"] == 100


def test_himalayas_partial_failure():
    requested_pages = []

    def mock_response(request):
        page = int(request.url.params["page"])
        requested_pages.append(page)

        if page == 2:
            return httpx.Response(500)

        return httpx.Response(
            200,
            json={"jobs": [{"guid": "test-job"}] * 20, "totalCount": 100},
        )

    transport = httpx.MockTransport(mock_response)
    real_client = httpx.Client

    with patch(
        "job_agent.himalayas.httpx.Client",
        side_effect=lambda: real_client(transport=transport),
    ):
        results = get_himalayas_jobs([{"q": "python developer"}], 40)

    assert requested_pages == [1, 2]
    assert len(results) == 1
    assert len(results[0]["jobs"]) == 20
    assert results[0]["outcome"] == "partial"
    assert results[0]["total_jobs"] == 100
