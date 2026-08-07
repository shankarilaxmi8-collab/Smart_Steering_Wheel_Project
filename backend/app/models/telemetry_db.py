# backend/app/models/telemetry_db.py
from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime, timezone
from backend.app.database import Base

class TelemetryLog(Base):
    __tablename__ = "telemetry_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    # --- OLD SENSORS ---
    heart_rate = Column(Float, nullable=False)
    gsr = Column(Float, nullable=False)
    grip_pressure = Column(Float, nullable=False)
    skin_temperature = Column(Float, nullable=False)
    
    # --- NEW AI SENSORS ---
    ecg_signal = Column(Float, default=0.0)
    rr_interval = Column(Float, default=0.0)
    qrs_duration = Column(Float, default=0.0)
    st_deviation = Column(Float, default=0.0)
    qt_interval = Column(Float, default=0.0)
    confidence = Column(Float, default=0.0)
    
    # --- PREDICTIONS ---
    raw_prediction = Column(String, nullable=False)
    stabilized_prediction = Column(String, nullable=False)
    alert_level = Column(String, default="NORMAL")  # Stores 'NORMAL', 'WARNING', or 'CRITICAL'