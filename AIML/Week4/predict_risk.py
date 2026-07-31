import os
import sys
from pathlib import Path

print("=== STARTING WEEK 4 INFERENCE TEST ===")

try:
    import joblib
    print("Joblib loaded successfully.")
except ImportError:
    print("ERROR: joblib is not installed! Run 'pip install joblib'")
    sys.exit(1)

from collections import deque

BASE_DIR = Path(__file__).resolve().parents[1]
model_file = BASE_DIR / "Week3" / "Model Output" / "cardiac_model.joblib"

print(f"Checking for model file at: {model_file}")

if not os.path.exists(model_file):
    print("ERROR: Model file missing! Check your Week 3 output folder.")
    sys.exit(1)

print("Model file found! Loading model into memory...")
model = joblib.load(model_file)
print("Model successfully loaded!")

class CardiacInferenceEngine:
    def __init__(self, trained_model, buffer_size=3):
        self.model = trained_model
        self.buffer_size = buffer_size
        self.prediction_history = deque(maxlen=buffer_size)
        self.current_stable_state = 0
        self.labels = {0: "Normal", 1: "Warning", 2: "Critical"}

    def process_sample(self, features):
        """
        Processes a single feature vector [hr_mean, hr_std, gsr_mean, temp_mean]
        and returns stabilized risk analysis.
        """
        raw_pred = int(self.model.predict([features])[0])
        self.prediction_history.append(raw_pred)

        # Hysteresis Filter Logic
        if len(self.prediction_history) == self.buffer_size:
            if all(p == raw_pred for p in self.prediction_history):
                self.current_stable_state = raw_pred

        return {
            "raw": self.labels[raw_pred],
            "stabilized": self.labels[self.current_stable_state],
            "buffer": list(self.prediction_history)
        }

engine = CardiacInferenceEngine(model, buffer_size=3)

def predict_risk(features):
    """
    Predict driver risk using the trained model.
    features = [heart_rate, gsr, grip_pressure, temperature]
    """

    result = engine.process_sample(features)

    return {
        "raw_prediction": result["raw"],
        "stabilized_prediction": result["stabilized"]
    }

sample_stream = [
    [72.5, 2.1, 4.2, 36.6],    # Normal
    [73.0, 2.0, 4.1, 36.5],    # Normal
    [145.0, 15.2, 18.5, 38.9],  # Sudden noisy spike
    [74.0, 2.2, 4.3, 36.6],    # Back to Normal
    [150.0, 16.0, 19.0, 39.1],  # Critical Start
    [152.0, 16.5, 19.2, 39.2],  # Critical Persistent
    [151.0, 16.1, 19.1, 39.0],  # Critical Confirmed
]




print("\n--- STABILIZATION INFERENCE RESULTS ---")

for i, sample in enumerate(sample_stream, 1):
    res = engine.process_sample(sample)
    print(
        f"Sec {i}: Raw = {res['raw']:<8} | "
        f"Stabilized = {res['stabilized']:<8} | "
        f"Buffer = {res['buffer']}"
    )

print("\n=== WEEK 4 INFERENCE TEST COMPLETE ===")
