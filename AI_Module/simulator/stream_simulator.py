import time
from pathlib import Path
import sys

# Ensure parent path is in sys.path
sys.path.append(str(Path(__file__).resolve().parents[2]))

from AI_Module.AIML.Week4.predict_risk import CardiacInferenceEngine

def start_simulation():
    engine = CardiacInferenceEngine()
    
    # Simulating a transition from NORMAL -> WARNING -> CARDIAC EVENT
    simulation_stream = [
        # Normal driving (3 seconds)
        {"heart_rate_bpm": 72, "sweat_microsiemens": 3.0, "skin_temp_celsius": 34.0, "grip_force_newton": 20, "ecg_signal": 0.0, "rr_interval_ms": 830, "qrs_duration_ms": 90, "st_deviation_mv": 0.0, "qt_interval_ms": 390},
        {"heart_rate_bpm": 74, "sweat_microsiemens": 3.1, "skin_temp_celsius": 33.9, "grip_force_newton": 20, "ecg_signal": 0.01, "rr_interval_ms": 825, "qrs_duration_ms": 90, "st_deviation_mv": 0.0, "qt_interval_ms": 391},
        {"heart_rate_bpm": 75, "sweat_microsiemens": 3.2, "skin_temp_celsius": 33.8, "grip_force_newton": 19, "ecg_signal": 0.02, "rr_interval_ms": 820, "qrs_duration_ms": 91, "st_deviation_mv": 0.01, "qt_interval_ms": 392},
        # Stress / Warning onset (2 seconds)
        {"heart_rate_bpm": 92, "sweat_microsiemens": 5.5, "skin_temp_celsius": 32.5, "grip_force_newton": 12, "ecg_signal": 0.15, "rr_interval_ms": 690, "qrs_duration_ms": 105, "st_deviation_mv": 0.15, "qt_interval_ms": 425},
        {"heart_rate_bpm": 95, "sweat_microsiemens": 5.8, "skin_temp_celsius": 32.3, "grip_force_newton": 11, "ecg_signal": 0.18, "rr_interval_ms": 680, "qrs_duration_ms": 108, "st_deviation_mv": 0.18, "qt_interval_ms": 430},
        # Cardiac Event onset (3 seconds)
        {"heart_rate_bpm": 125, "sweat_microsiemens": 12.0, "skin_temp_celsius": 29.5, "grip_force_newton": 4, "ecg_signal": 0.48, "rr_interval_ms": 500, "qrs_duration_ms": 135, "st_deviation_mv": 0.50, "qt_interval_ms": 485},
        {"heart_rate_bpm": 128, "sweat_microsiemens": 12.5, "skin_temp_celsius": 29.2, "grip_force_newton": 3, "ecg_signal": 0.52, "rr_interval_ms": 490, "qrs_duration_ms": 138, "st_deviation_mv": 0.52, "qt_interval_ms": 490},
        {"heart_rate_bpm": 130, "sweat_microsiemens": 13.0, "skin_temp_celsius": 29.0, "grip_force_newton": 2, "ecg_signal": 0.55, "rr_interval_ms": 480, "qrs_duration_ms": 140, "st_deviation_mv": 0.55, "qt_interval_ms": 495},
    ]

    print("Starting simulated live stream (1-second intervals)...\n")
    for t, sample in enumerate(simulation_stream, start=1):
        res = engine.process_sample(sample)
        print(f"[T={t}s] Raw: {res['raw_prediction']:<15} | Stable: {res['stable_prediction']:<15} | Confidence: {res['confidence']}%")
        time.sleep(1)

if __name__ == "__main__":
    start_simulation()