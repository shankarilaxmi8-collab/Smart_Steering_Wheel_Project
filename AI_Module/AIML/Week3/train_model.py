import os
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
from xgboost import XGBClassifier

# Path setup: saves model to AI_Module/models/
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
AI_MODULE_DIR = os.path.dirname(os.path.dirname(CURRENT_DIR))
MODELS_DIR = os.path.join(AI_MODULE_DIR, "models")
os.makedirs(MODELS_DIR, exist_ok=True)

FEATURE_COLUMNS = [
    "heart_rate_bpm",
    "hrv_rmssd_ms",
    "gsr_microsiemens",
    "hand_temp_celsius",
    "grip_force_n",
    "rr_interval_ms",
    "qrs_duration_ms",
    "st_deviation_mv",
    "qt_interval_ms",
]

def generate_training_data(n_samples: int = 10000) -> pd.DataFrame:
    np.random.seed(42)
    n = n_samples // 4

    # 1. Normal
    normal = pd.DataFrame({
        "heart_rate_bpm": np.random.normal(72, 8, n),
        "hrv_rmssd_ms": np.random.normal(38, 7, n),
        "gsr_microsiemens": np.random.normal(3.2, 0.8, n),
        "hand_temp_celsius": np.random.normal(34.2, 0.5, n),
        "grip_force_n": np.random.normal(25.0, 3.0, n),
        "rr_interval_ms": np.random.normal(830, 90, n),
        "qrs_duration_ms": np.random.normal(90, 6, n),
        "st_deviation_mv": np.random.normal(0.01, 0.02, n),
        "qt_interval_ms": np.random.normal(390, 20, n),
        "label": 0
    })

    # 2. Stress
    stress = pd.DataFrame({
        "heart_rate_bpm": np.random.normal(105, 10, n),
        "hrv_rmssd_ms": np.random.normal(22, 5, n),
        "gsr_microsiemens": np.random.normal(8.5, 1.5, n),
        "hand_temp_celsius": np.random.normal(33.0, 0.6, n),
        "grip_force_n": np.random.normal(55.0, 8.0, n),
        "rr_interval_ms": np.random.normal(570, 50, n),
        "qrs_duration_ms": np.random.normal(92, 6, n),
        "st_deviation_mv": np.random.normal(0.03, 0.03, n),
        "qt_interval_ms": np.random.normal(370, 20, n),
        "label": 0
    })

    # 3. Exercise
    exercise = pd.DataFrame({
        "heart_rate_bpm": np.random.normal(135, 12, n),
        "hrv_rmssd_ms": np.random.normal(15, 4, n),
        "gsr_microsiemens": np.random.normal(12.0, 2.0, n),
        "hand_temp_celsius": np.random.normal(35.5, 0.5, n),
        "grip_force_n": np.random.normal(38.0, 4.0, n),
        "rr_interval_ms": np.random.normal(440, 40, n),
        "qrs_duration_ms": np.random.normal(88, 5, n),
        "st_deviation_mv": np.random.normal(0.02, 0.03, n),
        "qt_interval_ms": np.random.normal(340, 20, n),
        "label": 0
    })

    # 4. Emergency
    hr = np.concatenate([np.random.normal(145, 12, n//2), np.random.normal(38, 5, n - n//2)])
    np.random.shuffle(hr)
    grip = np.concatenate([np.random.normal(2.5, 0.8, int(n * 0.8)), np.random.normal(85.0, 5.0, n - int(n * 0.8))])
    np.random.shuffle(grip)

    emergency = pd.DataFrame({
        "heart_rate_bpm": hr,
        "hrv_rmssd_ms": np.random.normal(8.5, 2.5, n),
        "gsr_microsiemens": np.random.normal(14.5, 3.0, n),
        "hand_temp_celsius": np.random.normal(29.8, 1.0, n),
        "grip_force_n": np.clip(grip, 0.0, 100.0),
        "rr_interval_ms": np.random.normal(410, 80, n),
        "qrs_duration_ms": np.random.normal(132, 14, n),
        "st_deviation_mv": np.random.normal(0.24, 0.08, n),
        "qt_interval_ms": np.random.normal(495, 30, n),
        "label": 1
    })

    return pd.concat([normal, stress, exercise, emergency], ignore_index=True).sample(frac=1.0, random_state=42)

def main():
    print("⏳ [Week 3] Training ML Model...")
    df = generate_training_data()
    X = df[FEATURE_COLUMNS]
    y = df["label"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

    xgb = XGBClassifier(n_estimators=150, max_depth=4, learning_rate=0.05, eval_metric="logloss", random_state=42)
    model = CalibratedClassifierCV(estimator=xgb, method="sigmoid", cv=5)
    model.fit(X_train, y_train)

    # Save to AI_Module/models/cardiac_risk_model.joblib
    export_path = os.path.join(MODELS_DIR, "cardiac_risk_model.joblib")
    joblib.dump({"model": model, "feature_names": FEATURE_COLUMNS}, export_path)
    print(f"✅ [Week 3] Model trained and exported to: {export_path}")

if __name__ == "__main__":
    main()