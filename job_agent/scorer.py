from anthropic import Anthropic
from dotenv import load_dotenv
from job_agent.models import JobRecord
import os

SCORE_JOB_PROMPT = """
You are evaluating job postings for fit against a specific candidate's background and target criteria, described in the candidate profile below. For each job posting provided, assess how well it matches that profile, and return your evaluation in the exact JSON format specified.
Weigh these factors in your evaluation:

Trust the job description text over structured metadata fields (like a labeled "experience level") when they conflict. Postings are sometimes mislabeled — e.g., a job tagged "entry-level" that actually requires 5+ years of experience should be judged by its actual requirements, not its label.
Seniority/experience mismatches are a strong negative signal. If a posting clearly requires significantly more professional experience than the candidate has, this should substantially lower the score, even if other aspects of the role look appealing.
Not every posting is a real job. Some entries may be recruiting events, expired listings, or non-job content that happened to be classified as a job posting. Treat these as not relevant, and note this explicitly in your rationale if you encounter one.

is_relevant and score represent different judgments. Mark is_relevant: false only for hard disqualifiers: any deal-breaker listed in the candidate profile, the posting not being a real job, or the posting being a substantively different type of role than the candidate's targets despite superficial keyword or title overlap (e.g., a "Market Research Analyst" role that is actually recruiting/sourcing work, not data analysis). For jobs that pass this bar but have a middling fit — such as an experience mismatch, tool-stack mismatch, or partial domain fit — mark is_relevant: true and let the score reflect the degree of fit. Apply any positive or negative signals described in the candidate profile when scoring.

When a job has multiple independent disqualifying factors, you don't need to enumerate all of them in the rationale — identify enough of the most significant ones to justify the assessment, rather than exhaustively covering every issue.
""".strip()


CANDIDATE_PROFILE = """
Background: The candidate holds a CS degree with a dual focus in software development and data science (summa cum laude), and is transitioning from a clinical healthcare career. They are a licensed Pediatric Nurse Practitioner (PNP) and Registered Nurse (RN), with prior experience in direct clinical care (evaluating children for abuse/neglect, expert witness testimony), nursing/clinical support, residency program coordination, and Epic EHR configuration/support. They have no prior professional experience in software engineering or data analysis, but bring 15+ years of healthcare domain expertise alongside formal CS education.

Technical skills: Languages — Python, SQL, Java, JavaScript, HTML, CSS. Tools/technologies — Git, Jupyter, Databricks, PySpark, MySQL, PostgreSQL, AWS, Snowflake, Django, React, Jenkins, Power BI. Demonstrated project experience includes: full-stack web development (React, Django REST Framework, PostgreSQL, JWT authentication, role-based access control), machine learning pipelines (scikit-learn, XGBoost, Random Forest, SHAP explainability), unsupervised learning (K-Medoids, K-Modes clustering, NLP-based feature engineering), and ETL/data pipeline design (Python, Snowflake, Power BI dashboarding).

Target roles: Entry-level data analyst or entry-level/associate/graduate software engineer roles. Example titles include (but aren't limited to) Software Engineer I, Associate Software Engineer, Graduate Software Engineer, Data Analyst, Python Developer — titles are illustrative, not an exhaustive filter; judge based on the actual work described, not just the title.

Experience level: 0 years professional experience in this field; targeting entry-level / 0-2 years roles.

Location: Fully remote only.

Employment type: Prefers full-time, but open to other arrangements at this stage.

Deal-breakers (automatic reject): Requires a degree the candidate doesn't have; requires significant travel; not fully remote.

Positive signals (stronger candidates, not required): Healthcare-adjacent roles — health data analyst, clinical data roles, healthtech companies — should be weighted as a stronger fit than a generic data/software role, given the candidate's healthcare domain background. For healthcare-adjacent technical roles specifically, deep clinical/healthcare domain expertise can meaningfully offset a technical experience gap — e.g., a healthtech role requiring 2-3 years of technical experience but requiring healthcare domain knowledge may still be a strong fit despite the technical gap, since domain expertise reduces the ramp-up time a purely technical candidate would need.
""".strip()

OUTPUT_FORMAT = """
Output Format: Respond with only a JSON object, no other text, in exactly this structure:
{
    "score": <float between 0.0 and 1.0 where 1.0 is an excellent fit and 0.0 is not relevant at all>,
    "is_relevant": <true or false>,
    "score_details": "<your reasoning for the score, written in clear prose. Explain the specific factors that drove your assessment, both positive and negative.>" 
}""".strip()

FULL_PROMPT = "\n\n".join([SCORE_JOB_PROMPT, CANDIDATE_PROFILE, OUTPUT_FORMAT])


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


def score_job(job_data: JobRecord):
    load_dotenv()
    client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
    job_text = format_job_for_prompt(job_data)
    print(job_text)

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=[
            {
                "type": "text",
                "text": FULL_PROMPT,
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
