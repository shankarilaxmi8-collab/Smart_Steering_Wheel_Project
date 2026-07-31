<<<<<<< HEAD
import csv
import os
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix

# 1. Define Exact File Paths matching your folder tree
BASE_DIR = "D:/ITR_PROJECT_FINAL/AIML"

data_path = os.path.join(BASE_DIR, "Week2", "DatasetProcessed", "processed_driver_features.csv")

# Create a Model Output subfolder in Week 3 if it doesn't exist
week3_dir = os.path.join(BASE_DIR, "Week 3")
model_dir = os.path.join(week3_dir, "Model Output")
os.makedirs(model_dir, exist_ok=True)

model_output_path = os.path.join(model_dir, "cardiac_model.joblib")
report_path = os.path.join(week3_dir, "model_evaluation_report.md")

print(f"Loading processed dataset from: {data_path}")

# 2. Load Processed Dataset
X = []
y = []

try:
    with open(data_path, mode="r") as f:
        reader = csv.DictReader(f)
        for row in reader:
            features = [
                float(row["hr_rolling_mean"]),
                float(row["hr_rolling_std"]),
                float(row["gsr_rolling_mean"]),
                float(row["temp_rolling_mean"])
            ]
            label = int(row["condition_label"])
            
            X.append(features)
            y.append(label)

    print(f"Successfully loaded {len(X)} feature windows.")

    # 3. Train / Test Split (80% Training, 20% Testing)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # 4. Train Random Forest Classifier
    clf = RandomForestClassifier(n_estimators=50, max_depth=5, random_state=42)
    clf.fit(X_train, y_train)

    # 5. Evaluate Model Performance
    y_pred = clf.predict(X_test)
    report = classification_report(
        y_test, y_pred, target_names=["Normal (0)", "Warning (1)", "Critical (2)"]
    )
    conf_matrix = confusion_matrix(y_test, y_pred)

    print("\n--- MODEL EVALUATION RESULTS ---")
    print(report)
    print("Confusion Matrix:")
    print(conf_matrix)

    # 6. Save the Trained Model File (Hand-off artifact)
    joblib.dump(clf, model_output_path)
    print(f"\nSUCCESS: Saved trained model to '{model_output_path}'")

    # 7. Write Evaluation Report
    with open(report_path, mode="w") as f:
        f.write("# Week 3 AI Model Evaluation Report\n\n")
        f.write("## Model Architecture\n")
        f.write("- **Algorithm:** Random Forest Classifier\n")
        f.write("- **Input Features:** `[hr_rolling_mean, hr_rolling_std, gsr_rolling_mean, temp_rolling_mean]`\n")
        f.write("- **Output Classes:** `0: Normal`, `1: Warning`, `2: Critical`\n\n")
        f.write("## Performance Metrics\n```\n")
        f.write(report)
        f.write("\n```\n")

    print(f"Saved evaluation report to '{report_path}'")

except FileNotFoundError:
    print(f"Error: Could not locate '{data_path}'. Please check that Week 2 execution completed.")
=======
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
>>>>>>> 8d0a8e8 (commit all files)
