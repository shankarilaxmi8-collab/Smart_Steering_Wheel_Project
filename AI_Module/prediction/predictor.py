import os
import joblib
import time
import numpy as np
from collections import deque
from typing import Dict, Any, List, Tuple
from AI_Module.prediction.preprocess import preprocess_telemetry

class SteeringWheelPredictor:
    def __init__(self, model_path: str = None, persistence_window_sec: float = 5.0):
        if model_path is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            # Priority 1: Trained XGBoost model in AI_Module/models/
            model_path = os.path.join(base_dir, "models", "cardiac_risk_model.joblib")
            if not os.path.exists(model_path):
                # Priority 2: Alternative location in ml_pipeline/saved_models/
                model_path = os.path.join(base_dir, "ml_pipeline", "saved_models", "cardiac_risk_model.joblib")

        self.model_path = model_path
        self.model = None
        self.load_model()

        # Sliding window buffer: stores (timestamp, raw_risk_score)
        self.history = deque()
        self.window_sec = persistence_window_sec

    def load_model(self):
        if os.path.exists(self.model_path):
            artifact = joblib.load(self.model_path)
            self.model = artifact["model"] if isinstance(artifact, dict) and "model" in artifact else artifact
            print(f"✅ Loaded ML model from: {self.model_path}")
        else:
            print(f"⚠️ Model artifact not found at {self.model_path}. Using heuristic rule fallback.")

    def _compute_rule_penalty(self, metrics: Dict[str, float]) -> Tuple[float, List[str]]:
        reasons = []
        penalty = 0.0

        if abs(metrics.get("st_deviation_mv", 0.0)) > 0.15:
            penalty += 35.0
            reasons.append(f"ST Deviation Alert: {metrics['st_deviation_mv']:+.2f} mV")
        if metrics.get("qrs_duration_ms", 90.0) > 120.0:
            penalty += 25.0
            reasons.append(f"Wide QRS Complex: {metrics['qrs_duration_ms']:.1f} ms")
        if metrics.get("hrv_rmssd_ms", 35.0) < 12.0 and metrics.get("heart_rate_bpm", 75.0) > 125:
            penalty += 20.0
            reasons.append("Severe HRV crash during high tachycardia")
        if metrics.get("hand_temp_celsius", 34.0) < 30.5 and metrics.get("gsr_microsiemens", 3.0) > 10.0:
            penalty += 20.0
            reasons.append("Cold sweat / peripheral shock pattern")
        if metrics.get("grip_force_n", 25.0) < 5.0:
            penalty += 30.0
            reasons.append("Loss of steering wheel grip (<5N) - Possible loss of consciousness")
        elif metrics.get("grip_force_n", 25.0) > 80.0:
            penalty += 15.0
            reasons.append("Extreme steering wheel grip tension (>80N)")

        return min(penalty, 100.0), reasons

    def predict(self, telemetry_data: Dict[str, Any]) -> Dict[str, Any]:
        current_time = time.time()
        features, metrics = preprocess_telemetry(telemetry_data)

        # 1. Base ML Probability
        ml_prob = 0.0
        if self.model is not None:
            try:
                ml_prob = float(self.model.predict_proba(features)[0][1]) * 100.0
            except Exception:
                ml_prob = 0.0

        # 2. Clinical Rule Score
        rule_score, reasons = self._compute_rule_penalty(metrics)

        # 3. Composite Risk Calculation
        instant_risk = min(100.0, (0.50 * ml_prob) + (0.50 * rule_score))

        # 4. Temporal Persistence Filter (Sliding 5-second window)
        self.history.append((current_time, instant_risk))
        while self.history and self.history[0][0] < current_time - self.window_sec:
            self.history.popleft()

        persistent_risk = float(np.mean([score for _, score in self.history]))

        # 5. Status Classification
        if persistent_risk >= 70.0:
            status = "CRITICAL"
        elif persistent_risk >= 40.0:
            status = "WARNING"
        else:
            status = "NORMAL"

        return {
            "risk_score": round(persistent_risk, 1),
            "status": status,
            "metrics": metrics,
            "trigger_reasons": reasons if status != "NORMAL" else []
        }

# Aliases for backwards compatibility with any existing ROS2/test scripts
Predictor = SteeringWheelPredictor
HealthPredictor = SteeringWheelPredictor