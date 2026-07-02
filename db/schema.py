from sqlalchemy import (
    Table,
    Column,
    MetaData,
    Integer,
    String,
    Text,
    Float,
    Boolean,
    DateTime,
    Date,
    JSON,
    Enum,
    ForeignKey,
    func,
)

metadata_obj = MetaData()

jobs = Table(
    "jobs",
    metadata_obj,
    Column("1.id", Integer, autoincrement=True, primary_key=True),
    Column("title", String(255)),
    Column("company_name", String(255)),
    Column("description", Text, nullable=False),
    Column("employment_type", String(50)),
    Column("experience_level", JSON),
    Column("location", JSON),
    Column("categories", JSON),
    Column("pub_date", Date),
    Column("expiry_date", Date),
    Column("application_url", Text, nullable=False),
    Column("source", String(50), nullable=False),
    Column("search_query", String(50), nullable=False),
    Column("qualified", Boolean),
    Column("date_fetched", DateTime, nullable=False, server_default=func.now()),
    Column("created", DateTime, server_default=func.now()),
    Column("last_update", DateTime, onupdate=func.now()),
)

scores = Table(
    "scores",
    metadata_obj,
    Column("id", Integer, autoincrement=True, primary_key=True),
    Column("job_id", ForeignKey("jobs.id"), nullable=False),
    Column("score", Float, nullable=False),
    Column("score_details", Text),
    Column("date_scored", DateTime),
    Column("created", Date, server_default=func.now()),
)

applications = Table(
    "applications",
    metadata_obj,
    Column("id", autoincrement=True, primary_key=True),
    Column("job_id", ForeignKey("jobs.id"), nullable=False),
    Column("portal", Boolean),
    Column("date_applied", DateTime),
    Column(
        "status",
        Enum("pending", "applied", "interviewing", "rejected", "withdrawn"),
        nullable=False,
    ),
    Column("response_received", Boolean),
    Column("response_date", Date),
    Column("created", Date, server_default=func.now()),
    Column("last_update", DateTime, onupdate=func.now()),
)


def create_tables(engine):
    metadata_obj.create_all(engine)
