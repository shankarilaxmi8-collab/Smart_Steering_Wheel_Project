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
                print(f"Warning: Model not found at {MODEL_PATH}")
            else:
                model = joblib.load(MODEL_PATH)

        if scaler is None:
            if not SCALER_PATH.exists():
                print(f"Warning: Scaler not found at {SCALER_PATH}")
            else:
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

        # Convert list to dictionary if backend passes a list
        if isinstance(sensor, (list, tuple)):
            sensor = {
                "heart_rate_bpm": sensor[0] if len(sensor) > 0 else 75,
                "sweat_microsiemens": sensor[1] if len(sensor) > 1 else 3.0,
                "grip_force_newton": sensor[2] if len(sensor) > 2 else 16,
                "skin_temp_celsius": sensor[3] if len(sensor) > 3 else 33.5,
                "ecg_signal": sensor[4] if len(sensor) > 4 else 0.0,
                "rr_interval_ms": sensor[5] if len(sensor) > 5 else 800,
                "qrs_duration_ms": sensor[6] if len(sensor) > 6 else 90,
                "st_deviation_mv": sensor[7] if len(sensor) > 7 else 0.01,
                "qt_interval_ms": sensor[8] if len(sensor) > 8 else 390
            }

        # Use .get() to prevent KeyErrors if names don't match perfectly
        features = [[
            sensor.get("heart_rate_bpm", sensor.get("heart_rate", 74.0)),
            sensor.get("sweat_microsiemens", sensor.get("gsr", 3.2)),
            sensor.get("skin_temp_celsius", sensor.get("skin_temperature", 33.6)),
            sensor.get("grip_force_newton", sensor.get("grip_pressure", 16.0)),
            sensor.get("ecg_signal", 0.02),
            sensor.get("rr_interval_ms", 810.0),
            sensor.get("qrs_duration_ms", 91.0),
            sensor.get("st_deviation_mv", 0.01),
            sensor.get("qt_interval_ms", 392.0)
        ]]

        scaled = self.scaler.transform(features)
        prediction = int(self.model.predict(scaled)[0])
        probabilities = self.model.predict_proba(scaled)[0]
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

# ====================================================
# Global Engine Instance & FastAPI Wrapper
# ====================================================
engine = CardiacInferenceEngine()

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

# --------------------------------------------------
# Manual Test (Only runs when executed directly)
# --------------------------------------------------

if __name__ == "__main__":

    print("Loading Cardiac Inference Engine...\n")

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