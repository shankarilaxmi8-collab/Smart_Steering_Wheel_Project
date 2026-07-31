import os
import sys
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, "..", ".."))

# Search paths for processed dataset
DATA_PATH = os.path.join(PROJECT_ROOT, "AIML", "Week2", "DatasetProcessed", "processed_driver_features.csv")
if not os.path.exists(DATA_PATH):
    DATA_PATH = os.path.join(PROJECT_ROOT, "AIML", "Week2", "DatasetProcessed", "processed_driver_features.csv")

OUTPUT_DIR = os.path.join(SCRIPT_DIR, "ModelOutput")
MODEL_SAVE_PATH = os.path.join(OUTPUT_DIR, "cardiac_model.joblib")
REPORT_SAVE_PATH = os.path.join(SCRIPT_DIR, "model_evaluation_report.md")

os.makedirs(OUTPUT_DIR, exist_ok=True)

print(f"Loading processed dataset from: {DATA_PATH}")
if not os.path.exists(DATA_PATH):
    print(f"Error: Could not locate dataset at '{DATA_PATH}'.")
    sys.exit(1)

df = pd.read_csv(DATA_PATH)
print("Dataset columns found:", list(df.columns))

feature_cols = ["hr_rolling_mean", "hr_rolling_std", "gsr_rolling_mean", "temp_rolling_mean"]
X = df[feature_cols]

# Auto-detect target column or generate baseline labels
if "risk_level" in df.columns:
    y = df["risk_level"]
elif "cardiac_risk_level" in df.columns:
    y = df["cardiac_risk_level"]
elif "target" in df.columns:
    y = df["target"]
else:
    print("Warning: No target column found. Deriving risk labels from heart rate rules...")
    # Derive risk: Normal (<100 BPM), Warning (100-130 BPM), Critical (>130 BPM)
    y = df["hr_rolling_mean"].apply(lambda hr: 0 if hr < 100 else (1 if hr <= 130 else 2))

# Train Model
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

print("Training Random Forest Classifier...")
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

# Save Model Artifact
joblib.dump(rf_model, MODEL_SAVE_PATH)
print(f"SUCCESS: Model saved to: {MODEL_SAVE_PATH}")

# Save Report
y_pred = rf_model.predict(X_test)
report = classification_report(y_test, y_pred)

with open(REPORT_SAVE_PATH, "w") as f:
    f.write("# Model Evaluation Report\n\n```\n" + report + "\n```\n")

print(f"Evaluation report saved to: {REPORT_SAVE_PATH}")

