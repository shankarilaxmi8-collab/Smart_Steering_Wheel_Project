from AI_Module.prediction.preprocess import preprocess


sample = {

    # Vital sensors
    "heart_rate_bpm": 78,
    "sweat_microsiemens": 3.3,
    "skin_temp_celsius": 33.5,
    "grip_force_newton": 16,

    # ECG
    
    "ecg_signal":0.02,

    # ECG derived features
    "rr_interval_ms": 805,
    "qrs_duration_ms": 91,
    "st_deviation_mv": 0.01,
    "qt_interval_ms": 392

}


scaled = preprocess(sample)


print("=" * 50)
print("PREPROCESS TEST")
print("=" * 50)

print("Input:")
for key, value in sample.items():
    print(f"{key}: {value}")


print("\nProcessed Output:")
print(scaled)


print("\nPreprocess Test Passed")