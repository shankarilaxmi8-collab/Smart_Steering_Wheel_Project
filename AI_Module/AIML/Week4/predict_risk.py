import os
from pathlib import Path
from collections import deque

import joblib


# --------------------------------------------------
# Paths
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parents[2]

MODEL_PATH = BASE_DIR / "models" / "knn_model.pkl"
SCALER_PATH = BASE_DIR / "models" / "scaler.pkl"


# --------------------------------------------------
# Cardiac Inference Engine
# --------------------------------------------------

class CardiacInferenceEngine:

    def __init__(self, model=None, scaler=None, buffer_size=3):

        if model is None:
            if not MODEL_PATH.exists():
                raise FileNotFoundError(f"Model not found: {MODEL_PATH}")

            model = joblib.load(MODEL_PATH)

        if scaler is None:
            if not SCALER_PATH.exists():
                raise FileNotFoundError(f"Scaler not found: {SCALER_PATH}")

            scaler = joblib.load(SCALER_PATH)

        self.model = model
        self.scaler = scaler

        self.buffer_size = buffer_size
        self.history = deque(maxlen=buffer_size)
        self.stable_state = 0

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

        features = [[
            sensor["heart_rate_bpm"],
            sensor["sweat_microsiemens"],
            sensor["skin_temp_celsius"],
            sensor["grip_force_newton"],
            sensor["ecg_signal"],
            sensor["rr_interval_ms"],
            sensor["qrs_duration_ms"],
            sensor["st_deviation_mv"],
            sensor["qt_interval_ms"]
        ]]

        scaled = self.scaler.transform(features)

        prediction = int(self.model.predict(scaled)[0])

        probabilities = self.model.predict_proba(scaled)[0]

        features_scaled = self.scaler.transform(features)
        prediction = int(self.model.predict(features_scaled)[0])
        probabilities = self.model.predict_proba(features_scaled)[0]
        confidence = float(probabilities[prediction]) * 100

        self.history.append(prediction)

        if len(self.history) == self.buffer_size:
            if all(x == prediction for x in self.history):
                self.stable_state = prediction

        return {
            "raw_prediction": self.labels[prediction],
            "stable_prediction": self.labels[self.stable_state],
            "confidence": round(confidence, 2),
            "buffer": list(self.history)
        }


# --------------------------------------------------
# Manual Test
# --------------------------------------------------

if __name__ == "__main__":

    print("Loading Cardiac Inference Engine...\n")

    engine = CardiacInferenceEngine()

    samples = [

        {
            "heart_rate_bpm":74,
            "sweat_microsiemens":3.2,
            "skin_temp_celsius":33.6,
            "grip_force_newton":16,
            "ecg_signal":0.02,
            "rr_interval_ms":810,
            "qrs_duration_ms":91,
            "st_deviation_mv":0.01,
            "qt_interval_ms":392
        },

        {
            "heart_rate_bpm":90,
            "sweat_microsiemens":4.9,
            "skin_temp_celsius":33.0,
            "grip_force_newton":12,
            "ecg_signal":0.11,
            "rr_interval_ms":700,
            "qrs_duration_ms":101,
            "st_deviation_mv":0.12,
            "qt_interval_ms":421
        },

        {
            "heart_rate_bpm":121,
            "sweat_microsiemens":12.6,
            "skin_temp_celsius":29.5,
            "grip_force_newton":4,
            "ecg_signal":0.46,
            "rr_interval_ms":515,
            "qrs_duration_ms":136,
            "st_deviation_mv":0.48,
            "qt_interval_ms":481
        }

    ]

    print("========== INFERENCE RESULTS ==========\n")

    for i, sample in enumerate(samples, start=1):

        result = engine.process_sample(sample)

        print(f"Sample {i}")
        print(result)
        print("-" * 50)
