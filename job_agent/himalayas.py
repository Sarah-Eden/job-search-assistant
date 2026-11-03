from db.schema import JobApiParams
import httpx
import logging

logger = logging.getLogger(__name__)


def build_search_params(terms: JobApiParams, params: list[JobApiParams]):

    params_dict = {item.param_name: item for item in params}
    search_params = []

    if "timezone" in params_dict:
        for item in terms.param_value:
            for value in params_dict["timezone"].param_value:
                search_params.append({"q": item, "timezone": value})
    else:
        search_params = [{"q": value} for value in terms.param_value]

    for k, v in params_dict.items():
        if k not in ("timezone", "retrieval_limit"):
            for item in search_params:
                item[k] = ",".join(v.param_value)

    return (search_params, int(params_dict["retrieval_limit"].param_value[0]))


def get_himalayas_jobs(search_params, max_jobs):
    url = "https://himalayas.app/jobs/api/search"
    num_pages = (max_jobs // 20) if (max_jobs % 20 == 0) else ((max_jobs // 20) + 1)
    new_jobs = []

    with httpx.Client() as client:
        for terms in search_params:
            jobs = []
            outcome = "success"
            total_jobs = None
            try:
                for num in range(num_pages):
                    params = {**terms, "page": num + 1}
                    response = client.get(url, params=params, timeout=15)
                    response.raise_for_status()
                    data = response.json()

                    if total_jobs is None:
                        total_jobs = data.get("totalCount")

                    if data["jobs"] == []:
                        break

                    jobs.extend(data["jobs"])

            except httpx.RequestError as e:
                logger.error(f"Request error occurred while requesting {e.request.url}")
                outcome = "partial" if jobs else "error"
            except httpx.HTTPStatusError as e:
                logger.error(
                    f"Error response {e.response.status_code} requesting jobs from {e.request.url}"
                )
                outcome = "partial" if jobs else "error"

            new_jobs.append(
                {
                    "jobs": jobs[:max_jobs],
                    "params": terms,
                    "outcome": outcome,
                    "total_jobs": total_jobs,
                }
            )

    return new_jobs
