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