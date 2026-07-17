from anthropic import Anthropic
from dotenv import load_dotenv
from job_agent.models import JobRecord
from pathlib import Path
import os

BASE_DIR = Path(__file__).parent.parent

OUTPUT_FORMAT = """
Output Format: Respond with only a JSON object, no other text, in exactly this structure:
{
    "score": <float between 0.0 and 1.0 where 1.0 is an excellent fit and 0.0 is not relevant at all>,
    "is_relevant": <true or false>,
    "score_details": "<your reasoning for the score, written in clear prose. Explain the specific factors that drove your assessment, both positive and negative.>" 
}""".strip()


def format_job_for_prompt(job: JobRecord):
    job_string = f"""Job Title: {job.title} 
Company: {job.company_name} 
Employment Type: {job.employment_type}
Experience Type: {job.experience_level}
Location: {job.location} 
Categories: {job.categories}
Expiry Date: {job.expiry_date}
Description: {job.description}"""

    return job_string


def get_prompt():
    instructions_and_profile = (
        open(BASE_DIR / "profile.md", encoding="utf-8").read().strip()
    )
    return "\n\n".join([instructions_and_profile, OUTPUT_FORMAT])


def score_job(job_data: JobRecord):

    load_dotenv()
    client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

    job_text = format_job_for_prompt(job_data)
    prompt = get_prompt()

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=[
            {
                "type": "text",
                "text": prompt,
                "cache_control": {"type": "ephemeral"},
            }
        ],
        messages=[{"role": "user", "content": job_text}],
    )
    print(response.usage)
    return response.content[0].text


if __name__ == "__main__":
    from job_agent.db.connection import get_engine
    from job_agent.db.repository import JobRepository

    engine = get_engine()
    repo = JobRepository(engine)
    test_job = repo.get_unscored_jobs()[0]

    result = score_job(test_job)
    print(result)
