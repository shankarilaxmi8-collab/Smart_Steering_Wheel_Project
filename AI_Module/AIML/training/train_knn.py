import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report

# Load dataset
df = pd.read_csv("D:/ITR_PROJECT_FINAL/AIML/dataset_generator/generated_dataset.csv")

# Features
X = df.drop(columns=["driver_id", "timestamp_offset", "condition_label"])

# Target
y = df["condition_label"]

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# Scale features
scaler = StandardScaler()

X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Train model
model = KNeighborsClassifier(n_neighbors=5)

model.fit(X_train, y_train)

# Predict
pred = model.predict(X_test)

print("Accuracy :", accuracy_score(y_test, pred))
print(classification_report(y_test, pred))

# Save
joblib.dump(model, "AI_Module/models/knn_model.pkl")
joblib.dump(scaler, "AI_Module/models/scaler.pkl")

print("Model Saved Successfully")