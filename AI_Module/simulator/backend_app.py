import os
import sys
import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any

# Ensure project root is on sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(os.path.dirname(CURRENT_DIR))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# Import your Week 4 ML Risk Predictor
from AI_Module.AIML.Week4.predict_risk import RiskPredictor

app = FastAPI(title="Smart Steering Wheel Simulator Backend")

# Enable CORS for local testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the ML Predictor
predictor = RiskPredictor()

class TelemetryPayload(BaseModel):
    speed: Optional[int] = 0
    stress_mode: Optional[str] = "normal"

@app.get("/")
async def serve_index():
    return FileResponse(os.path.join(CURRENT_DIR, "index.html"))

@app.post("/api/telemetry")
async def process_telemetry(payload: TelemetryPayload):
    mode = payload.stress_mode.lower() if payload.stress_mode else "normal"
    speed = payload.speed

    # Generate situation-based sensor telemetry frame
    if mode == "cardiac":
        sensor_frame = {
            "heart_rate_bpm": 148.0,
            "hrv_rmssd_ms": 10.0,
            "gsr_microsiemens": 12.5,
            "hand_temp_celsius": 38.4,
            "skin_temp_celsius": 38.4,
            "grip_force_n": 48.0,
            "grip_force_newton": 48.0,
            "sweat_microsiemens": 12.5,
            "ecg_signal_mv": 1.15,
            "ecg_morphology": {
                "rr_interval_ms": 410.0,
                "qrs_duration_ms": 130.0,
                "st_deviation_mv": 0.35,
                "qt_interval_ms": 480.0,
            }
        }
        emergency_active = True
    elif mode == "warning":
        sensor_frame = {
            "heart_rate_bpm": 102.0,
            "hrv_rmssd_ms": 22.0,
            "gsr_microsiemens": 6.8,
            "hand_temp_celsius": 37.2,
            "skin_temp_celsius": 37.2,
            "grip_force_n": 35.0,
            "grip_force_newton": 35.0,
            "sweat_microsiemens": 6.8,
            "ecg_signal_mv": 0.45,
            "ecg_morphology": {
                "rr_interval_ms": 580.0,
                "qrs_duration_ms": 105.0,
                "st_deviation_mv": 0.12,
                "qt_interval_ms": 420.0,
            }
        }
        emergency_active = False
    else:  # normal
        sensor_frame = {
            "heart_rate_bpm": 72.0,
            "hrv_rmssd_ms": 38.0,
            "gsr_microsiemens": 3.0,
            "hand_temp_celsius": 36.6,
            "skin_temp_celsius": 36.6,
            "grip_force_n": 22.0,
            "grip_force_newton": 22.0,
            "sweat_microsiemens": 3.0,
            "ecg_signal_mv": 0.0,
            "ecg_morphology": {
                "rr_interval_ms": 830.0,
                "qrs_duration_ms": 88.0,
                "st_deviation_mv": 0.0,
                "qt_interval_ms": 390.0,
            }
        }
        emergency_active = False

    # Execute ML Risk Inference via RiskPredictor
    prediction_result = predictor.compute_risk(sensor_frame)
    risk_score = prediction_result.get("risk_score", 0.0)
    status = prediction_result.get("status", "NORMAL")

    # Correct confidence calculation based on the classified status
    if status == "NORMAL":
        confidence = round(100.0 - risk_score, 1)
    elif status == "CRITICAL":
        confidence = round(risk_score, 1)
    else:  # WARNING
        confidence = round(max(risk_score, 100.0 - risk_score), 1)

    return {
        "sensors": {
            "heart_rate_bpm": sensor_frame["heart_rate_bpm"],
            "skin_temp_celsius": sensor_frame["skin_temp_celsius"],
            "grip_force_newton": sensor_frame["grip_force_newton"],
            "sweat_microsiemens": sensor_frame["sweat_microsiemens"],
            "st_deviation_mv": sensor_frame["ecg_morphology"]["st_deviation_mv"],
            "speed": speed
        },
        "prediction": {
            "risk_score": risk_score,
            "stable_prediction": status,
            "confidence": confidence
        },
        "emergency_protocol": {
            "active": emergency_active or (status == "CRITICAL")
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)