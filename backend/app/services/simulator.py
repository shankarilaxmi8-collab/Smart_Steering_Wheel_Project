import math
from pathlib import Path

import numpy as np
import pandas as pd

from backend.app.models.schemas import RiskStatus, TelemetryInput


DATA_PATH = Path(__file__).resolve().parents[2] / "data" / "processed_driver_features.csv"
df = pd.read_csv(DATA_PATH)
current_index = 0

STATUS_BY_LABEL: dict[int, RiskStatus] = {
    0: "NORMAL",
    1: "WARNING",
    2: "CRITICAL",
}


def reset_demo(index: int = 0) -> None:
    """Reset the CSV cursor for deterministic tests and local demonstrations."""
    global current_index
    current_index = index % len(df)


def get_sensor_data() -> tuple[int, TelemetryInput, RiskStatus]:
    """Return one deterministic dummy-data frame and its documented scenario status.

    The CSV is the source of truth for the demonstration state.  The returned
    telemetry is still sent to the model separately, but incomplete CSV fields
    must never make the dashboard contradict the known demo scenario.
    """
    global current_index
    row = df.iloc[current_index]
    timestamp = int(row["timestamp_offset"])
    heart_rate = float(row["hr_rolling_mean"])

    scenario_status = STATUS_BY_LABEL.get(int(row["condition_label"]), "UNKNOWN")

    frame = TelemetryInput(
        heart_rate=heart_rate,
        hrv=max(float(row["hr_rolling_std"]), 1.0),
        gsr=float(row["gsr_rolling_mean"]),
        # The source CSV has no grip column; use the documented normal simulator baseline.
        grip_pressure=25.0,
        skin_temperature=float(row["temp_rolling_mean"]),
        ecg_signal=0.0,
        rr_interval=60_000.0 / max(heart_rate, 20.0),
        qrs_duration=90.0,
        st_deviation=0.0,
        qt_interval=390.0,
    )
    current_index = (current_index + 1) % len(df)
    return timestamp, frame, scenario_status


def generate_ecg_chunk(
    heart_rate: float, num_samples: int = 50, sample_rate: int = 250, phase_offset: float = 0.0
) -> list[float]:
    """Generate a continuous synthetic ECG display chunk; it is not diagnostic data."""
    bpm = max(40.0, min(180.0, float(heart_rate)))
    frequency = bpm / 60.0
    t = np.arange(num_samples) / sample_rate
    phase = (phase_offset + t * frequency) % 1.0
    ecg = 0.015 * np.sin(2 * np.pi * frequency * t)

    for i, p in enumerate(phase):
        if 0.10 <= p <= 0.20:
            ecg[i] += 0.12 * math.sin(math.pi * (p - 0.10) / 0.10)
        elif 0.32 <= p <= 0.35:
            ecg[i] -= 0.12
        elif 0.35 < p <= 0.40:
            ecg[i] += math.sin(math.pi * (p - 0.35) / 0.05)
        elif 0.40 < p <= 0.45:
            ecg[i] -= 0.20
        elif 0.60 <= p <= 0.75:
            ecg[i] += 0.20 * math.sin(math.pi * (p - 0.60) / 0.15)

    return (ecg + np.random.normal(0, 0.01, num_samples)).round(3).tolist()
