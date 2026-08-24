from datetime import datetime
from typing import Literal

from pydantic import AliasChoices, BaseModel, ConfigDict, Field


RiskStatus = Literal["NORMAL", "WARNING", "CRITICAL", "UNKNOWN"]


class TelemetryInput(BaseModel):
    """Canonical sensor frame accepted from hardware, ROS, or a simulator."""

    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    timestamp: datetime | None = None
    heart_rate: float = Field(
        validation_alias=AliasChoices("heart_rate", "heart_rate_bpm"), ge=20, le=250
    )
    hrv: float = Field(
        default=35.0, validation_alias=AliasChoices("hrv", "hrv_rmssd_ms"), ge=0, le=300
    )
    gsr: float = Field(
        validation_alias=AliasChoices("gsr", "gsr_microsiemens", "sweat_microsiemens"), ge=0, le=100
    )
    grip_pressure: float = Field(
        validation_alias=AliasChoices("grip_pressure", "grip_force_n", "grip_force_newton"), ge=0, le=200
    )
    skin_temperature: float = Field(
        validation_alias=AliasChoices("skin_temperature", "hand_temp_celsius", "skin_temp_celsius"), ge=15, le=50
    )
    ecg_signal: float = Field(
        default=0.0, validation_alias=AliasChoices("ecg_signal", "ecg_signal_mv"), ge=-10, le=10
    )
    rr_interval: float | None = Field(
        default=None, validation_alias=AliasChoices("rr_interval", "rr_interval_ms"), ge=200, le=3000
    )
    qrs_duration: float = Field(
        default=90.0, validation_alias=AliasChoices("qrs_duration", "qrs_duration_ms"), ge=20, le=300
    )
    st_deviation: float = Field(
        default=0.0, validation_alias=AliasChoices("st_deviation", "st_deviation_mv"), ge=-5, le=5
    )
    qt_interval: float = Field(
        default=390.0, validation_alias=AliasChoices("qt_interval", "qt_interval_ms"), ge=100, le=1000
    )

    def model_for_inference(self) -> dict[str, float]:
        rr_interval = self.rr_interval or (60_000.0 / self.heart_rate)
        return {
            "heart_rate_bpm": self.heart_rate,
            "hrv_rmssd_ms": self.hrv,
            "gsr_microsiemens": self.gsr,
            "hand_temp_celsius": self.skin_temperature,
            "grip_force_n": self.grip_pressure,
            "ecg_signal_mv": self.ecg_signal,
            "rr_interval_ms": rr_interval,
            "qrs_duration_ms": self.qrs_duration,
            "st_deviation_mv": self.st_deviation,
            "qt_interval_ms": self.qt_interval,
        }


class PredictionResult(BaseModel):
    raw_prediction: RiskStatus
    stabilized_prediction: RiskStatus
    confidence: float = Field(ge=0, le=1)
    risk_score: float = Field(ge=0, le=100)
    status: RiskStatus
    available: bool = True


class DriverStatus(BaseModel):
    schema_version: str = "1.0"
    timestamp: str | int
    heart_rate: float
    hrv: float
    gsr: float
    grip_pressure: float
    skin_temperature: float
    ecg_signal: float
    rr_interval: float
    qrs_duration: float
    st_deviation: float
    qt_interval: float
    condition: RiskStatus
    status: RiskStatus
    scenario_status: RiskStatus = "UNKNOWN"
    prediction: PredictionResult
    sensor_status: str


class TelemetryRecord(DriverStatus):
    id: int
