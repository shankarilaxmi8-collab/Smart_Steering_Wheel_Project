from AI_Module.prediction.predictor import predict


samples = [

    {
        "name": "NORMAL",

        "heart_rate_bpm": 74,
        "sweat_microsiemens": 3.2,
        "skin_temp_celsius": 33.6,
        "grip_force_newton": 16,
        "ecg_signal": 0.02,
        "rr_interval_ms": 810,
        "qrs_duration_ms": 92,
        "st_deviation_mv": 0.01,
        "qt_interval_ms": 390
    },

    {
        "name": "WARNING",

        "heart_rate_bpm": 90,
        "sweat_microsiemens": 4.6,
        "skin_temp_celsius": 33.1,
        "grip_force_newton": 12,
        "ecg_signal": 0.18,
        "rr_interval_ms": 700,
        "qrs_duration_ms": 104,
        "st_deviation_mv": 0.12,
        "qt_interval_ms": 420
    },

    {
        "name": "CARDIAC_EVENT",

        "heart_rate_bpm": 118,
        "sweat_microsiemens": 11.0,
        "skin_temp_celsius": 30.5,
        "grip_force_newton": 5,
        "ecg_signal": 0.45,
        "rr_interval_ms": 520,
        "qrs_duration_ms": 138,
        "st_deviation_mv": 0.42,
        "qt_interval_ms": 490
    }

]


print("=" * 60)
print("PREDICTOR TEST")
print("=" * 60)

for sample in samples:

    print(f"\nTesting {sample['name']}")

    data = sample.copy()
    del data["name"]

    result = predict(data)

    print("Prediction :", result["label"])
    print("Confidence :", result["confidence"])
    print("Probabilities :", result["probabilities"])

print("\nPredictor Test Passed")