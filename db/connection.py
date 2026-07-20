from pathlib import Path
from sqlalchemy import create_engine, URL
from dotenv import load_dotenv
import tomllib
import os

BASE_DIR = Path(__file__).parent.parent.parent


def get_engine():
    load_dotenv(BASE_DIR / ".env")

    with open(BASE_DIR / "config.toml", "rb") as f:
        config = tomllib.load(f)

    if config["database"]["db"] == "postgresql":

        url_object = URL.create(
            "postgresql+psycopg",
            username=os.environ.get("DATABASE_USERNAME"),
            password=os.environ.get("DATABASE_PASSWORD"),
            host=config["database"]["pgsql"]["host"],
            port=config["database"]["pgsql"]["port"],
            database=config["database"]["pgsql"]["name"],
        )
        engine = create_engine(url_object, echo=True)

    elif config["database"]["db"] == "sqlite":
        url_object = URL.create(
            "sqlite+pysqlite",
            database=str(BASE_DIR / config["database"]["sqlite"]["path"]),
        )
        engine = create_engine(url_object, echo=True)

    else:
        raise ValueError(
            "Failed to identify database type. Please verify contents of config.toml"
        )

    return engine
