import tomllib
import requests
import logging
from pathlib import Path
from bs4 import BeautifulSoup

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

        response_text = response.json()

    except (requests.exceptions.RequestException, TypeError) as e:
        logger.error(f"Error fetching data: {e}")
        return []

    return [standardize_himalayas_job(job) for job in response_text["jobs"]]


def standardize_himalayas_job(job: dict):
    selected_keys = [
        "guid",
        "title",
        "companyName",
        "employmentType",
        "seniority",
        "description",
        "locationRestrictions",
        "timezoneRestrictions",
        "categories",
        "parentCategories",
        "pubDate",
        "expiryDate",
        "applicationLink",
    ]

    clean_job = {k: job.get(k, None) for k in selected_keys}
    raw_description = job.get("description") or ""
    soup = BeautifulSoup(raw_description, "html.parser")
    clean_job["description"] = soup.get_text(separator=" ")

    return clean_job


if __name__ == "__main__":
    jobs = get_himalayas_jobs()
    for job in jobs:
        print(job)
