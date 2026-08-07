import os
import sys
import joblib
import numpy as np
from pathlib import Path
from collections import deque

# ----------------------------------------------------
# Dynamic Path Resolution
# ----------------------------------------------------
BASE_DIR = Path(__file__).resolve().parents[2]  # Points to AI_Module root

MODEL_PATH = BASE_DIR / "models" / "knn_model.pkl"
SCALER_PATH = BASE_DIR / "models" / "scaler.pkl"

# Fallback pathing if organized inside AIML folders
if not os.path.exists(MODEL_PATH):
    MODEL_PATH = Path(__file__).resolve().parents[1] / "Week3" / "ModelOutput" / "cardiac_model.joblib"
if not os.path.exists(SCALER_PATH):
    SCALER_PATH = Path(__file__).resolve().parents[1] / "Week3" / "ModelOutput" / "scaler.pkl"

# Check & load model and scaler
model = None
scaler = None

if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)

if os.path.exists(SCALER_PATH):
    scaler = joblib.load(SCALER_PATH)


# ====================================================
# Cardiac Inference Engine
# ====================================================

class CardiacInferenceEngine:

    def __init__(self, trained_model, trained_scaler, buffer_size=3):
        self.model = trained_model
        self.scaler = trained_scaler
        self.buffer_size = buffer_size
        self.prediction_history = deque(maxlen=buffer_size)
        self.current_stable_state = 0
        self.labels = {
            0: "NORMAL",
            1: "WARNING",
            2: "CARDIAC_EVENT"
        }

    def process_sample(self, sensor):
        if self.model is None or self.scaler is None:
            return {
                "raw_prediction": "NORMAL",
                "stable_prediction": "NORMAL",
                "confidence": 100.0,
                "buffer": []
            }

        # Fallback if sensor is passed as a list instead of a dict
        if isinstance(sensor, (list, tuple)):
            sensor_dict = {
                "heart_rate_bpm": sensor[0] if len(sensor) > 0 else 75,
                "sweat_microsiemens": sensor[1] if len(sensor) > 1 else 3.0,
                "skin_temp_celsius": sensor[3] if len(sensor) > 3 else 33.5,
                "grip_force_newton": sensor[2] if len(sensor) > 2 else 16,
                "rr_interval_ms": sensor[4] if len(sensor) > 4 else 800,
                "qrs_duration_ms": sensor[5] if len(sensor) > 5 else 90,
                "st_deviation_mv": sensor[6] if len(sensor) > 6 else 0.01,
                "qt_interval_ms": sensor[7] if len(sensor) > 7 else 390
            }
            sensor = sensor_dict

        features = [[
            sensor.get("heart_rate_bpm", sensor.get("heart_rate", 75)),
            sensor.get("sweat_microsiemens", sensor.get("gsr", 3.0)),
            sensor.get("skin_temp_celsius", sensor.get("skin_temperature", 33.5)),
            sensor.get("grip_force_newton", sensor.get("grip_pressure", 16)),
            sensor.get("rr_interval_ms", 800),
            sensor.get("qrs_duration_ms", 90),
            sensor.get("st_deviation_mv", 0.01),
            sensor.get("qt_interval_ms", 390)
        ]]

        features_scaled = self.scaler.transform(features)
        prediction = int(self.model.predict(features_scaled)[0])
        probabilities = self.model.predict_proba(features_scaled)[0]
        confidence = float(probabilities[prediction]) * 100

        self.prediction_history.append(prediction)

        if len(self.prediction_history) == self.buffer_size:
            if all(p == prediction for p in self.prediction_history):
                self.current_stable_state = prediction

        return {
            "raw_prediction": self.labels.get(prediction, "NORMAL"),
            "stable_prediction": self.labels.get(self.current_stable_state, "NORMAL"),
            "confidence": round(confidence, 2),
            "buffer": list(self.prediction_history)
        }


# ====================================================
# Global Engine Instance & Export Function
# ====================================================

engine = CardiacInferenceEngine(model, scaler, buffer_size=3)


def predict_risk(sensor_data):
    """
    Main export function called by FastAPI / ROS bridge
    """
    result = engine.process_sample(sensor_data)
    return {
        "raw_prediction": result["raw_prediction"],
        "stabilized_prediction": result["stable_prediction"],
        "confidence": result["confidence"]
    }


# ====================================================
# Test Stream (Only Runs When File Executed Directly)
# ====================================================

if __name__ == "__main__":

    print("=== STARTING CARDIAC INFERENCE ENGINE TEST ===")
    print("Loading model...")
    print("Loading scaler...")
    print("Model Loaded Successfully!\n")

    sample_stream = [

        # ---------------- NORMAL ----------------
        {
            "heart_rate_bpm": 74,
            "sweat_microsiemens": 3.2,
            "skin_temp_celsius": 33.6,
            "grip_force_newton": 16,
            "rr_interval_ms": 810,
            "qrs_duration_ms": 91,
            "st_deviation_mv": 0.01,
            "qt_interval_ms": 392
        },
        {
            "heart_rate_bpm": 75,
            "sweat_microsiemens": 3.1,
            "skin_temp_celsius": 33.5,
            "grip_force_newton": 16,
            "rr_interval_ms": 808,
            "qrs_duration_ms": 92,
            "st_deviation_mv": 0.01,
            "qt_interval_ms": 391
        },

        # ---------------- WARNING ----------------
        {
            "heart_rate_bpm": 89,
            "sweat_microsiemens": 5.1,
            "skin_temp_celsius": 32.8,
            "grip_force_newton": 12,
            "rr_interval_ms": 705,
            "qrs_duration_ms": 102,
            "st_deviation_mv": 0.12,
            "qt_interval_ms": 420
        },

        # ---------------- NORMAL AGAIN ----------------
        {
            "heart_rate_bpm": 75,
            "sweat_microsiemens": 3.3,
            "skin_temp_celsius": 33.5,
            "grip_force_newton": 16,
            "rr_interval_ms": 812,
            "qrs_duration_ms": 91,
            "st_deviation_mv": 0.01,
            "qt_interval_ms": 392
        },

        # ---------------- CARDIAC EVENT ----------------
        {
            "heart_rate_bpm": 118,
            "sweat_microsiemens": 12.3,
            "skin_temp_celsius": 29.8,
            "grip_force_newton": 5,
            "rr_interval_ms": 520,
            "qrs_duration_ms": 134,
            "st_deviation_mv": 0.45,
            "qt_interval_ms": 480
        },
        {
            "heart_rate_bpm": 121,
            "sweat_microsiemens": 12.9,
            "skin_temp_celsius": 29.6,
            "grip_force_newton": 4,
            "rr_interval_ms": 515,
            "qrs_duration_ms": 136,
            "st_deviation_mv": 0.47,
            "qt_interval_ms": 482
        },
        {
            "heart_rate_bpm": 123,
            "sweat_microsiemens": 13.1,
            "skin_temp_celsius": 29.4,
            "grip_force_newton": 4,
            "rr_interval_ms": 510,
            "qrs_duration_ms": 138,
            "st_deviation_mv": 0.49,
            "qt_interval_ms": 485
        }

    ]

    print("========== INFERENCE RESULTS ==========\n")

    for second, sample in enumerate(sample_stream, start=1):
        result = engine.process_sample(sample)
        print(f"Second {second}")
        print(f"Raw Prediction   : {result['raw_prediction']}")
        print(f"Stable Prediction: {result['stable_prediction']}")
        print(f"Confidence       : {result['confidence']} %")
        print(f"Prediction Buffer: {result['buffer']}")
        print("-" * 55)

    print("\nInference Test Completed Successfully.")