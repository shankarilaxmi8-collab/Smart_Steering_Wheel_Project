from pydantic import BaseModel


class DriverStatus(BaseModel):
    timestamp: int
    heart_rate: float
    hrv: float
    gsr: float
    grip_pressure: float
    skin_temperature: float
    condition: str
    prediction: dict

from pydantic import BaseModel
from typing import Optional, List

# 1. The data coming IN to your backend
class SensorData(BaseModel):
    heart_rate: float
    gsr: float
    grip_pressure: float
    skin_temperature: float
    ecg_signal: float  # <-- ADD THIS NEW FIELD
    rr_interval: float
    qrs_duration: float
    st_deviation: float
    qt_interval: float

# 2. The AI prediction going OUT to the frontend
class PredictionResult(BaseModel):
    raw_prediction: str
    stabilized_prediction: str
    confidence: float
    buffer: List[int]

# 3. The full response package
class StatusResponse(BaseModel):
    sensors: SensorData
    prediction: PredictionResult