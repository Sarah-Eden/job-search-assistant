import tomllib
import requests
import logging
from pathlib import Path
from job_agent.models import JobSearchResults, FetchResult

BASE_DIR = Path(__file__).parent.parent
logger = logging.getLogger(__name__)

SOURCES = {
    "himalayas": {
        "endpoint": "https://himalayas.app/jobs/api/search",
        "query_param": "q",
    },
    "jobicy": {
        "endpoint": "https://jobicy.com/api/v2/remote-jobs",
        "query_param": "tag",
    },
}


def query_api(source, params, term):
    source_details = SOURCES[source]
    try:
        response = requests.get(source_details["endpoint"], params=params, timeout=5)

        # Jobicy uses HTTP 404 for searches with zero results
        if response.status_code == 404:
            body = response.json()
            if body.get("jobCount") == 0:
                logger.info(f"No results for {source}, {term}, {params}")
                return FetchResult(
                    source, term, params, JobSearchResults(jobs=[]), "no_results"
                )

        response.raise_for_status()

        if "application/json" not in response.headers.get("Content-Type", ""):
            logger.warning("Response not in JSON format.")
            raise TypeError("Response not in JSON format.")

        result = FetchResult(
            source,
            term,
            params,
            JobSearchResults.model_validate_json(response.text),
            "success",
        )
        return result

    except (requests.exceptions.RequestException, TypeError) as e:

        logger.error(f"Error fetching {source} for '{term}': {e}")
        return FetchResult(source, term, params, JobSearchResults(jobs=[]), "error")


def fetch_all_jobs():
    with open(BASE_DIR / "config.toml", "rb") as f:
        config = tomllib.load(f)

    results = []

    for term in config["search_terms"]["terms"]:
        for source in SOURCES:
            source_config = config["sources"][source]
            industries = source_config.get("industries", [None])
            fixed_params = {k: v for k, v in source_config.items() if k != "industries"}
            for industry in industries:
                params = fixed_params | {SOURCES[source]["query_param"]: term}
                if industry is not None:
                    params["industry"] = industry
                results.append(query_api(source, params, term))

    return results
