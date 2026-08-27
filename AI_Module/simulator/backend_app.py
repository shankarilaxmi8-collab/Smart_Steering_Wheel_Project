import os
import sys
import time
import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(os.path.dirname(CURRENT_DIR))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

try:
    from AI_Module.AIML.Week4.predict_risk import RiskPredictor
    predictor = RiskPredictor()
except Exception as e:
    print(
        f"[Warning] Could not load RiskPredictor ML module: {e}. Using fallback evaluation.")
    predictor = None

app = FastAPI(title="Smart Steering Wheel Simulator Backend")

# Enable full CORS for local camera to cloud Codespace communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Shared State between DMS camera and 3D WebGL Frontend
latest_dms_state = {
    "status": "ATTENTIVE",
    "stress_mode": "normal",
    "timestamp": time.time()
}

# One-way safety latch: once emergency triggers, stay in emergency until manually reset
emergency_latched = False


class DMSEvent(BaseModel):
    status: Optional[str] = "ATTENTIVE"
    state: Optional[str] = None
    stress_mode: Optional[str] = "normal"
    stress_level: Optional[str] = None
    dms_state: Optional[str] = None


class TelemetryPayload(BaseModel):
    speed: Optional[int] = 0
    stress_mode: Optional[str] = None


@app.get("/")
async def serve_index():
    return FileResponse(os.path.join(CURRENT_DIR, "index.html"))


@app.post("/api/dms_event")
async def receive_dms(event: DMSEvent):
    global latest_dms_state, emergency_latched

    # Resolve aliases
    status = event.status or event.state or event.dms_state or "ATTENTIVE"
    mode = event.stress_mode or event.stress_level or "normal"
    mode = mode.lower()

    if mode == "cardiac":
        emergency_latched = True

    latest_dms_state = {
        "status": status,
        "stress_mode": mode,
        "timestamp": time.time()
    }
    print(
        f"[DMS Received] Status: {status} | Mode: {mode} | Latch: {emergency_latched}")
    return {"message": "DMS event registered", "current_state": latest_dms_state}


@app.get("/api/dms_event")
async def get_dms():
    return latest_dms_state


@app.post("/api/reset_emergency")
async def reset_emergency():
    global emergency_latched, latest_dms_state
    emergency_latched = False
    latest_dms_state = {
        "status": "ATTENTIVE",
        "stress_mode": "normal",
        "timestamp": time.time()
    }
    return {"message": "Emergency latch reset"}


@app.post("/api/telemetry")
async def process_telemetry(payload: TelemetryPayload):
    global latest_dms_state, emergency_latched
    speed = payload.speed or 0

    # DMS camera takes priority over frontend default payload
    if emergency_latched:
        mode = "cardiac"
    elif latest_dms_state["stress_mode"] in ["warning", "cardiac"]:
        mode = latest_dms_state["stress_mode"]
    elif payload.stress_mode:
        mode = payload.stress_mode.lower()
    else:
        mode = "normal"

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
        default_status = "CRITICAL"
        default_risk = 94.5
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
        default_status = "WARNING"
        default_risk = 68.0
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
        default_status = "NORMAL"
        default_risk = 12.0

    if predictor:
        try:
            prediction_result = predictor.compute_risk(sensor_frame)
            risk_score = prediction_result.get("risk_score", default_risk)
            status = prediction_result.get("status", default_status)
        except Exception:
            risk_score = default_risk
            status = default_status
    else:
        risk_score = default_risk
        status = default_status

    confidence = round(100.0 - risk_score,
                       1) if status == "NORMAL" else round(risk_score, 1)

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
        },
        "dms": latest_dms_state
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
