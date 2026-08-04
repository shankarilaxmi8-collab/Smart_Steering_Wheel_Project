import joblib
import numpy as np

from AI_Module.prediction.preprocess import preprocess


# Load trained model
MODEL_PATH = "AI_Module/models/knn_model.pkl"

model = joblib.load(MODEL_PATH)


LABELS = {
    0: "NORMAL",
    1: "WARNING",
    2: "CARDIAC_EVENT"
}


def predict(sensor_data):
    """
    Predict driver condition from sensor readings.
    """

    # Scale input
    features = preprocess(sensor_data)

    # Predict class
    prediction = int(model.predict(features)[0])

    # Prediction probabilities
    probabilities = model.predict_proba(features)[0]

    confidence = float(np.max(probabilities))

    return {
        "prediction": prediction,
        "label": LABELS[prediction],
        "confidence": round(confidence, 4),
        "probabilities": {
            "NORMAL": round(float(probabilities[0]), 4),
            "WARNING": round(float(probabilities[1]), 4),
            "CARDIAC_EVENT": round(float(probabilities[2]), 4)
        }
    }


if __name__ == "__main__":

    sample = {
        "heart_rate_bpm": 74,
        "sweat_microsiemens": 3.2,
        "skin_temp_celsius": 33.6,
        "grip_force_newton": 16,
        "ecg_signal": 0.02,
        "rr_interval_ms": 810,
        "qrs_duration_ms": 92,
        "st_deviation_mv": 0.01,
        "qt_interval_ms": 390
    }

    result = predict(sample)

    print("\nPrediction Result")
    print("-----------------")
    print(result)