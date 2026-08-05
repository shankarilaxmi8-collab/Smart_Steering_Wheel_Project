# backend/app/models/telemetry_db.py
from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime, timezone
from backend.app.database import Base

class TelemetryLog(Base):
    __tablename__ = "telemetry_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    heart_rate = Column(Float, nullable=False)
    gsr = Column(Float, nullable=False)
    grip_pressure = Column(Float, nullable=False)
    skin_temperature = Column(Float, nullable=False)
    raw_prediction = Column(String, nullable=False)
    stabilized_prediction = Column(String, nullable=False)
    alert_level = Column(String, default="NORMAL")  # Stores 'NORMAL', 'WARNING', or 'CRITICAL'