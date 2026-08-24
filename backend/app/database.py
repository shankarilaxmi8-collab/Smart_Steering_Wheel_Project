from pathlib import Path

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker


DATABASE_PATH = Path(__file__).resolve().parents[2] / "telemetry.db"
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DATABASE_PATH.as_posix()}"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def migrate_schema() -> None:
    """Apply the small additive migration needed by existing prototype databases."""
    inspector = inspect(engine)
    if "telemetry_logs" not in inspector.get_table_names():
        return
    columns = {column["name"] for column in inspector.get_columns("telemetry_logs")}
    if "hrv" not in columns:
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE telemetry_logs ADD COLUMN hrv FLOAT DEFAULT 0.0"))


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
