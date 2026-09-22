import logging
from job_agent.fetcher import fetch_all_jobs
from collections import defaultdict

logging.basicConfig(level=logging.INFO)

results = fetch_all_jobs()

print(f"\nTotal FetchResults: {len(results)}\n")

job_dict = defaultdict(list)

for result in results:
    count = len(result.results.jobs) if result.results else 0
    industry = result.params.get("industry", "-")
    print(
        f"{result.source_name:10} | term={result.term:20} | industry={industry:15} | jobs={count} | status={result.status}"
    )

for result in results:
    if result.status == "success":
        for job in result.results.jobs:
            job_dict[job.application_url].append(
                (result.source_name, result.params.get("industry", "-"))
            )


for k, v in job_dict.items():
    if len(v) > 1:

        print(f"URL: {k}, Count: {len(v)}, values: {v}")
