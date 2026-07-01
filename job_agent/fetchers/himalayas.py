import tomllib
import requests
import logging
from pathlib import Path
from ..models import JobSearchResults

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).parent.parent.parent
ENDPOINT = "https://himalayas.app/jobs/api/search"


def get_himalayas_jobs():
    with open(BASE_DIR / "config.toml", "rb") as f:
        data = tomllib.load(f)

    try:
        response = requests.get(ENDPOINT, params=data["himalayas"], timeout=5)
        response.raise_for_status()

        if "application/json" not in response.headers.get("Content-Type", ""):
            logger.warning("Response is not JSON")
            raise TypeError("Response is not JSON")

        results = JobSearchResults.model_validate_json(response.text)

    except (requests.exceptions.RequestException, TypeError) as e:
        logger.error(f"Error fetching data: {e}")
        return []

    return results


if __name__ == "__main__":
    jobs = get_himalayas_jobs()
    for job in jobs:
        print(job)
