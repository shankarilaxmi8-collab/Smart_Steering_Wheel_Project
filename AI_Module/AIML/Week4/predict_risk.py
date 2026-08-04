import os
import sys
import joblib
import numpy as np
from collections import deque

print("=== STARTING CARDIAC INFERENCE ENGINE ===")

# ----------------------------------------------------
# Paths
# ----------------------------------------------------

BASE_DIR = r"D:\ITR_PROJECT_FINAL\AIML"

MODEL_PATH = os.path.join("AI_Module", "models", "knn_model.pkl")
SCALER_PATH = os.path.join("AI_Module", "models", "scaler.pkl")

# ----------------------------------------------------
# Check files
# ----------------------------------------------------

if not os.path.exists(MODEL_PATH):
    print(f"ERROR: Model not found -> {MODEL_PATH}")
    sys.exit(1)

if not os.path.exists(SCALER_PATH):
    print(f"ERROR: Scaler not found -> {SCALER_PATH}")
    sys.exit(1)

print("Loading model...")
model = joblib.load(MODEL_PATH)

print("Loading scaler...")
scaler = joblib.load(SCALER_PATH)

print("Model Loaded Successfully!\n")


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

        features = [[
            sensor["heart_rate_bpm"],
            sensor["sweat_microsiemens"],
            sensor["skin_temp_celsius"],
            sensor["grip_force_newton"],
            sensor["rr_interval_ms"],
            sensor["qrs_duration_ms"],
            sensor["st_deviation_mv"],
            sensor["qt_interval_ms"]
        ]]

        features = self.scaler.transform(features)

        prediction = int(self.model.predict(features)[0])

        probabilities = self.model.predict_proba(features)[0]

        confidence = float(probabilities[prediction]) * 100

        self.prediction_history.append(prediction)

        if len(self.prediction_history) == self.buffer_size:

            if all(p == prediction for p in self.prediction_history):

                self.current_stable_state = prediction

        return {

            "raw_prediction": self.labels[prediction],

            "stable_prediction": self.labels[self.current_stable_state],

            "confidence": round(confidence, 2),

            "buffer": list(self.prediction_history)

        }


# ====================================================
# Create Engine
# ====================================================

engine = CardiacInferenceEngine(
    model,
    scaler,
    buffer_size=3
)

# ====================================================
# Test Samples
# ====================================================

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

# ====================================================
# Run Test
# ====================================================

print("========== INFERENCE RESULTS ==========\n")

for second, sample in enumerate(sample_stream, start=1):

    result = engine.process_sample(sample)

    print(f"Second {second}")

    print(f"Raw Prediction      : {result['raw_prediction']}")

    print(f"Stable Prediction   : {result['stable_prediction']}")

    print(f"Confidence          : {result['confidence']} %")

    print(f"Prediction Buffer   : {result['buffer']}")

    print("-" * 55)

print("\nInference Test Completed Successfully.")