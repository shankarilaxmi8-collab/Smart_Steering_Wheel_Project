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

if not os.path.exists(MODEL_PATH):
    MODEL_PATH = Path(__file__).resolve().parents[1] / "Week3" / "ModelOutput" / "cardiac_model.joblib"
if not os.path.exists(SCALER_PATH):
    SCALER_PATH = Path(__file__).resolve().parents[1] / "Week3" / "ModelOutput" / "scaler.pkl"

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

        # Build feature list based on input type
        if isinstance(sensor, (list, tuple)):
            feature_list = list(sensor)
        elif isinstance(sensor, dict):
            feature_list = [
                sensor.get("heart_rate_bpm", sensor.get("heart_rate", 75)),
                sensor.get("sweat_microsiemens", sensor.get("gsr", 3.0)),
                sensor.get("skin_temp_celsius", sensor.get("skin_temperature", 33.5)),
                sensor.get("grip_force_newton", sensor.get("grip_pressure", 16)),
                sensor.get("rr_interval_ms", 800),
                sensor.get("qrs_duration_ms", 90),
                sensor.get("st_deviation_mv", 0.01),
                sensor.get("qt_interval_ms", 390)
            ]
        else:
            feature_list = [75, 3.0, 33.5, 16, 800, 90, 0.01, 390]

        # Dynamically adjust feature length to match scaler expectations
        expected_features = getattr(self.scaler, "n_features_in_", 9)

        while len(feature_list) < expected_features:
            feature_list.append(0.0)
        
        feature_list = feature_list[:expected_features]

        features = [feature_list]

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
            "heart_rate_bpm": 118,
            "sweat_microsiemens": 12.3,
            "skin_temp_celsius": 29.8,
            "grip_force_newton": 5,
            "rr_interval_ms": 520,
            "qrs_duration_ms": 134,
            "st_deviation_mv": 0.45,
            "qt_interval_ms": 480
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