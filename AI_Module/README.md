# AI / ML Physiological Inference Engine

## Overview
This module provides real-time physiological status classification (`NORMAL`, `WARNING`, `CARDIAC_EVENT`) based on multi-sensor input collected from the smart steering wheel.

## Feature Vector Specification
The model expects a dictionary or JSON payload containing the following 9 features in order:

| Feature | Field Name | Unit | Normal Range |
| :--- | :--- | :--- | :--- |
| Heart Rate | `heart_rate_bpm` | BPM | 60 - 100 |
| Sweat / GSR | `sweat_microsiemens` | µS | 1.0 - 5.0 |
| Skin Temperature | `skin_temp_celsius` | °C | 32.0 - 35.0 |
| Grip Force | `grip_force_newton` | N | 10 - 30 |
| ECG Signal | `ecg_signal` | mV | -0.5 - 1.5 |
| RR Interval | `rr_interval_ms` | ms | 600 - 1000 |
| QRS Duration | `qrs_duration_ms` | ms | 80 - 110 |
| ST Deviation | `st_deviation_mv` | mV | -0.05 - 0.05 |
| QT Interval | `qt_interval_ms` | ms | 350 - 440 |

## Model Details
- **Algorithm:** K-Nearest Neighbors (KNN)
- **Preprocessing:** Standard Scaling (`scaler.pkl`)
- **Classes:**
  - `0`: NORMAL
  - `1`: WARNING
  - `2`: CARDIAC_EVENT
- **Smoothing:** 3-sample sliding buffer to prevent noise spikes from triggering false alarms.

## Usage Example
```python
from AI_Module.AIML.Week4.predict_risk import CardiacInferenceEngine

engine = CardiacInferenceEngine()

sample = {
    "heart_rate_bpm": 120,
    "sweat_microsiemens": 12.5,
    "skin_temp_celsius": 29.5,
    "grip_force_newton": 4,
    "ecg_signal": 0.45,
    "rr_interval_ms": 515,
    "qrs_duration_ms": 136,
    "st_deviation_mv": 0.48,
    "qt_interval_ms": 480
}

result = engine.process_sample(sample)
print(result["stable_prediction"])  # CARDIAC_EVENT

---

### 2. Model Evaluation Script for Your Project Report
Guides and evaluators always ask for metrics (Accuracy, F1-Score, Confusion Matrix, and ROC/AUC curves). You can run this standalone evaluation script to generate figures for your project report and slides.

Create `AI_Module/tests/evaluate_model.py`:

```python
import joblib
import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.metrics import classification_report, confusion_matrix

BASE_DIR = Path(__file__).resolve().parents[1]
MODEL_PATH = BASE_DIR / "models" / "knn_model.pkl"
SCALER_PATH = BASE_DIR / "models" / "scaler.pkl"
DATASET_PATH = BASE_DIR / "simulator" / "synthetic_driver_data.csv"

def run_evaluation():
    if not DATASET_PATH.exists():
        print(f"Dataset not found at {DATASET_PATH}. Please verify the path.")
        return

    df = pd.read_csv(DATASET_PATH)
    
    feature_cols = [
        "heart_rate_bpm", "sweat_microsiemens", "skin_temp_celsius",
        "grip_force_newton", "ecg_signal", "rr_interval_ms",
        "qrs_duration_ms", "st_deviation_mv", "qt_interval_ms"
    ]
    
    X = df[feature_cols]
    y = df["target"]  # or "label" depending on your column name

    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)

    X_scaled = scaler.transform(X)
    y_pred = model.predict(X_scaled)

    print("\n========== MODEL EVALUATION REPORT ==========")
    print(classification_report(y, y_pred, target_names=["NORMAL", "WARNING", "CARDIAC_EVENT"]))
    
    print("========== CONFUSION MATRIX ==========")
    print(confusion_matrix(y, y_pred))

if __name__ == "__main__":
    run_evaluation()