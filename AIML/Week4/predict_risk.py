import os
import sys
import joblib
from collections import deque

class CardiacInferenceEngine:
    def __init__(self, model_path=None, buffer_size=3):
        """
        Inference engine with Hysteresis / Stabilization Filter.
        """
        if model_path is None:
            # Determine path relative to this script's directory
            SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
            PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, "..", ".."))
            model_path = os.path.join(PROJECT_ROOT, "AIML", "Week3", "ModelOutput", "cardiac_model.joblib")

        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at: {model_path}")

        self.model = joblib.load(model_path)
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
            "raw_prediction": raw_pred,
            "raw_label": self.labels[raw_pred],
            "stabilized_state": self.current_stable_state,
            "stabilized_label": self.labels[self.current_stable_state],
            "buffer_history": list(self.prediction_history)
        }


# --- GLOBAL SINGLETON FOR EASY BACKEND IMPORT ---
_engine_instance = None

def get_engine():
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = CardiacInferenceEngine()
    return _engine_instance


def predict_risk(features):
    """
    Backend Handoff Function:
    Accepts raw features [hr_mean, hr_std, gsr_mean, temp_mean]
    and returns stabilized risk prediction dictionary.
    """
    engine = get_engine()
    return engine.process_sample(features)


# --- OPTIONAL TEST RUNNER ---
if __name__ == "__main__":
    print("=== TESTING BACKEND PREDICT_RISK FUNCTION ===")
    test_vitals = [72.5, 2.1, 4.2, 36.6]
    result = predict_risk(test_vitals)
    print(f"Sample Input: {test_vitals}")
    print(f"Prediction Output: {result}")
    print("=== TEST PASSED ===")