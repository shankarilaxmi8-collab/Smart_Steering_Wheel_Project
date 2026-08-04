import pandas as pd
import joblib
import os

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report


# Load dataset
df = pd.read_csv(
    "AI_Module/AIML/dataset_generator/generated_dataset.csv"
)


# Features INCLUDING ECG
features = [

    "heart_rate_bpm",

    "sweat_microsiemens",

    "skin_temp_celsius",

    "grip_force_newton",

    "ecg_signal",

    "rr_interval_ms",

    "qrs_duration_ms",

    "st_deviation_mv",

    "qt_interval_ms"

]


X = df[features]


# Target
y = df["condition_label"]


# Split dataset
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



# Train KNN
model = KNeighborsClassifier(

    n_neighbors=5

)


model.fit(

    X_train,

    y_train

)


# Evaluation
prediction = model.predict(X_test)


print(
    "Accuracy :",
    accuracy_score(y_test, prediction)
)


print(
    classification_report(
        y_test,
        prediction
    )
)


# Save model
os.makedirs(
    "AI_Module/models",
    exist_ok=True
)


joblib.dump(

    model,

    "AI_Module/models/knn_model.pkl"

)


joblib.dump(

    scaler,

    "AI_Module/models/scaler.pkl"

)


print("Model Saved Successfully")