from job_agent.fetcher import fetch_all_jobs
from job_agent.db.repository import JobRepository
from job_agent.db.connection import get_engine


def main():
    db_engine = get_engine()
    repo = JobRepository(db_engine)

    job_results = fetch_all_jobs()

    for result in job_results:
        query_id = repo.create_search_query(
            result.term,
            result.source_name,
            result.params,
            result.status,
            len(result.results.jobs),
        )

        for job in result.results.jobs:
            status = repo.process_job_posting(job, query_id)


if __name__ == "__main__":
    main()
