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