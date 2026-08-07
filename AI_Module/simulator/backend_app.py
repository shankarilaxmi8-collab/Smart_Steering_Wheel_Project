import random
from pathlib import Path
import sys
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parents[2]
sys.path.append(str(BASE_DIR))

from AI_Module.AIML.Week4.predict_risk import CardiacInferenceEngine

app = FastAPI()
engine = CardiacInferenceEngine()

# Mount the static directory to serve demo_video.mp4
SIMULATOR_DIR = Path(__file__).parent
app.mount("/static", StaticFiles(directory=SIMULATOR_DIR), name="static")

class DriverPhysiologySimulator:
    def __init__(self):
        self.mode = "normal"
        self.hr = 72.0
        self.temp = 34.0
        self.grip = 20.0
        self.sweat = 3.0
        self.st_dev = 0.0

    def update(self, mode: str, speed: float):
        self.mode = mode
        if self.mode == "cardiac":
            target_hr, target_temp, target_grip, target_sweat, target_st = 125.0, 29.5, 4.0, 12.5, 0.48
        elif self.mode == "warning":
            target_hr, target_temp, target_grip, target_sweat, target_st = 92.0, 32.5, 12.0, 5.5, 0.15
        else:
            target_hr, target_temp, target_grip, target_sweat, target_st = 72.0, 34.0, 20.0, 3.0, 0.0

        self.hr += (target_hr - self.hr) * 0.25 + random.uniform(-0.8, 0.8)
        self.temp += (target_temp - self.temp) * 0.2 + random.uniform(-0.04, 0.04)
        self.grip += (target_grip - self.grip) * 0.25 + random.uniform(-0.4, 0.4)
        self.sweat += (target_sweat - self.sweat) * 0.2 + random.uniform(-0.08, 0.08)
        self.st_dev += (target_st - self.st_dev) * 0.25

        return {
            "heart_rate_bpm": int(self.hr),
            "sweat_microsiemens": round(max(0.5, self.sweat), 2),
            "skin_temp_celsius": round(self.temp, 1),
            "grip_force_newton": max(0, int(self.grip)),
            "ecg_signal": round(self.st_dev + random.uniform(-0.02, 0.02), 2),
            "rr_interval_ms": int(60000 / max(40, self.hr)),
            "qrs_duration_ms": 135 if self.mode == "cardiac" else 90,
            "st_deviation_mv": round(self.st_dev, 2),
            "qt_interval_ms": 480 if self.mode == "cardiac" else 390
        }

physio_sim = DriverPhysiologySimulator()

class TelemetryInput(BaseModel):
    speed: float
    stress_mode: str

@app.get("/", response_class=HTMLResponse)
def serve_dashboard():
    html_path = SIMULATOR_DIR / "index.html"
    return html_path.read_text()

@app.post("/api/telemetry")
def process_telemetry(data: TelemetryInput):
    sensor_data = physio_sim.update(data.stress_mode, data.speed)
    ai_result = engine.process_sample(sensor_data)
    is_cardiac = ai_result["stable_prediction"] == "CARDIAC_EVENT"
    return {
        "sensors": sensor_data,
        "prediction": ai_result,
        "emergency_protocol": {"active": is_cardiac}
    }