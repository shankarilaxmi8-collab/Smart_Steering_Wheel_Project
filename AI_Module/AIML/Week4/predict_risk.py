import os
import joblib
import pandas as pd
from typing import Dict, Any

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
AI_MODULE_DIR = os.path.dirname(os.path.dirname(CURRENT_DIR))
MODEL_PATH = os.path.join(AI_MODULE_DIR, "models", "cardiac_risk_model.joblib")

class RiskPredictor:
    def __init__(self):
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model not found at {MODEL_PATH}. Run Week3/train_model.py first.")
        artifact = joblib.load(MODEL_PATH)
        self.model = artifact["model"]
        self.feature_names = artifact["feature_names"]

    def compute_risk(self, telemetry_frame: Dict[str, Any]) -> Dict[str, Any]:
        """
        Accepts full telemetry (nested or flat), runs ML inference on extracted features,
        and preserves live ecg_signal_mv for dashboard streaming.
        """
        vitals = telemetry_frame.get("sensors", telemetry_frame)
        morphology = vitals.get("ecg_morphology", {})

        # Extract features for the ML model
        row = {
            "heart_rate_bpm": vitals.get("heart_rate_bpm", 72.0),
            "hrv_rmssd_ms": vitals.get("hrv_rmssd_ms", 35.0),
            "gsr_microsiemens": vitals.get("gsr_microsiemens", 3.0),
            "hand_temp_celsius": vitals.get("hand_temp_celsius", 34.0),
            "grip_force_n": vitals.get("grip_force_n", 25.0),
            "rr_interval_ms": morphology.get("rr_interval_ms", vitals.get("rr_interval_ms", 800.0)),
            "qrs_duration_ms": morphology.get("qrs_duration_ms", vitals.get("qrs_duration_ms", 90.0)),
            "st_deviation_mv": morphology.get("st_deviation_mv", vitals.get("st_deviation_mv", 0.0)),
            "qt_interval_ms": morphology.get("qt_interval_ms", vitals.get("qt_interval_ms", 390.0)),
        }

        df = pd.DataFrame([row])[self.feature_names]
        prob = float(self.model.predict_proba(df)[0][1]) * 100.0
        
        status = "CRITICAL" if prob >= 70 else ("WARNING" if prob >= 40 else "NORMAL")
        
        return {
            "risk_score": round(prob, 1),
            "status": status,
            "live_ecg_mv": vitals.get("ecg_signal_mv", 0.0), # Passed through for frontend display
            "features_evaluated": row
        }

if __name__ == "__main__":
    predictor = RiskPredictor()
    sample = {
        "heart_rate_bpm": 142.0,
        "hrv_rmssd_ms": 8.0,
        "gsr_microsiemens": 14.0,
        "hand_temp_celsius": 29.5,
        "grip_force_n": 3.0,
        "ecg_signal_mv": 1.15, # Live voltage wave point
        "ecg_morphology": {
            "rr_interval_ms": 410.0,
            "qrs_duration_ms": 135.0,
            "st_deviation_mv": 0.25,
            "qt_interval_ms": 490.0,
        }
    }
    print("--- [Week 4] Full Telemetry Prediction Test ---")
    print(predictor.compute_risk(sample))
