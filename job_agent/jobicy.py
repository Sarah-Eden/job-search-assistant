import requests
from db.connection import get_engine
from db.settings_repo import SettingsRepository


def get_locations():
    locations = {}

    response = requests.get(
        "https://jobicy.com/api/v2/remote-jobs?get=locations", timeout=5
    )
    response.raise_for_status()

    response = response.json()

    for loc in response["locations"]:
        locations[loc["geoName"]] = loc["geoSlug"]

    return locations


def get_industries():
    industries = {}

    response = requests.get(
        "https://jobicy.com/api/v2/remote-jobs?get=industries", timeout=5
    )

    response.raise_for_status()

    response = response.json()

    for i in response["industries"]:
        industries[i["industryName"]] = i["industrySlug"]

    return industries


def update_accepted_values():
    geo_values = get_locations()
    industry_values = get_industries()

    if geo_values and industry_values:
        engine = get_engine()
        repo = SettingsRepository(engine)
        repo.update_accepted_values("jobicy", "geo", geo_values)
        repo.update_accepted_values("jobicy", "industry", industry_values)
    else:
        raise ValueError("Jobicy returned empty taxonomy data")
