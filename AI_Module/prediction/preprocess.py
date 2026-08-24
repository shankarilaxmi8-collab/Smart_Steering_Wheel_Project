import numpy as np
from typing import Dict, Any, Tuple

DEFAULTS = {
    "heart_rate_bpm": 75.0,
    "hrv_rmssd_ms": 35.0,
    "gsr_microsiemens": 3.0,
    "hand_temp_celsius": 34.0,
    "grip_force_n": 25.0,        # <-- Default baseline grip force
    "ecg_signal_mv": 0.0,        # <-- Instantaneous raw ECG point
    "rr_interval_ms": 800.0,
    "qrs_duration_ms": 90.0,
    "st_deviation_mv": 0.0,
    "qt_interval_ms": 390.0,
}

FEATURE_COLUMNS = [
    "heart_rate_bpm",
    "hrv_rmssd_ms",
    "gsr_microsiemens",
    "hand_temp_celsius",
    "grip_force_n",              # <-- Added for ML inference
    "rr_interval_ms",
    "qrs_duration_ms",
    "st_deviation_mv",
    "qt_interval_ms",
]


def preprocess_telemetry(data: Dict[str, Any]) -> Tuple[np.ndarray, Dict[str, float]]:
    vitals = data.get("sensors", data)
    morphology = vitals.get("ecg_morphology", {})

    hr = float(vitals.get("heart_rate_bpm", DEFAULTS["heart_rate_bpm"]))
    rr = float(morphology.get("rr_interval_ms", vitals.get(
        "rr_interval_ms", (60.0 / max(hr, 30.0)) * 1000.0)))
    qrs = float(morphology.get("qrs_duration_ms", vitals.get(
        "qrs_duration_ms", DEFAULTS["qrs_duration_ms"])))
    st = float(morphology.get("st_deviation_mv", vitals.get(
        "st_deviation_mv", DEFAULTS["st_deviation_mv"])))
    qt = float(morphology.get("qt_interval_ms", vitals.get(
        "qt_interval_ms", DEFAULTS["qt_interval_ms"])))

    cleaned_metrics = {
        "heart_rate_bpm": hr,
        "hrv_rmssd_ms": float(vitals.get("hrv_rmssd_ms", DEFAULTS["hrv_rmssd_ms"])),
        "gsr_microsiemens": float(vitals.get("gsr_microsiemens", DEFAULTS["gsr_microsiemens"])),
        "hand_temp_celsius": float(vitals.get("hand_temp_celsius", DEFAULTS["hand_temp_celsius"])),
        "grip_force_n": float(vitals.get("grip_force_n", DEFAULTS["grip_force_n"])),
        "ecg_signal_mv": round(float(vitals.get("ecg_signal_mv", DEFAULTS["ecg_signal_mv"])), 4),
        "rr_interval_ms": round(rr, 2),
        "qrs_duration_ms": round(qrs, 2),
        "st_deviation_mv": round(st, 3),
        "qt_interval_ms": round(qt, 2),
    }

    feature_vector = np.array([[cleaned_metrics[col]
                              for col in FEATURE_COLUMNS]], dtype=np.float32)
    return feature_vector, cleaned_metrics


# Alias for backwards compatibility
preprocess = preprocess_telemetry
