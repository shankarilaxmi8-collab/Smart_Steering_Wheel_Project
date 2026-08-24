"""Adapter between the backend's public telemetry contract and the Week 4 model."""

from functools import lru_cache

from AI_Module.AIML.Week4.predict_risk import RiskPredictor
from backend.app.models.schemas import PredictionResult, TelemetryInput


@lru_cache(maxsize=1)
def get_predictor() -> RiskPredictor:
    return RiskPredictor()

def predict_telemetry(telemetry: TelemetryInput) -> PredictionResult:
    result = get_predictor().compute_risk(telemetry.model_for_inference())
    status = result["status"]
    risk_score = float(result["risk_score"])
    return PredictionResult(
        raw_prediction=status,
        stabilized_prediction=status,
        status=status,
        risk_score=risk_score,
        confidence=round(risk_score / 100.0, 4),
    )


def unavailable_prediction() -> PredictionResult:
    """Explicit fallback for demo streaming when the optional ML artifact is unavailable."""
    return PredictionResult(
        raw_prediction="UNKNOWN",
        stabilized_prediction="UNKNOWN",
        status="UNKNOWN",
        risk_score=0.0,
        confidence=0.0,
        available=False,
    )
