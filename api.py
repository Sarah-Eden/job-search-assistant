from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from db.connection import get_engine
from db.repository import JobRepository, JobRecord

app = FastAPI()
engine = get_engine()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


def get_repository() -> JobRepository:
    return JobRepository(engine)


@app.get("/jobs-new")
def get_new_jobs(repo: JobRepository = Depends(get_repository)) -> list[JobRecord]:
    return repo.get_new_relevant_jobs()
