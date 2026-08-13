import math
import numpy as np
import pandas as pd
from pathlib import Path


# ============================================================================
# DATASET
# ============================================================================

DATA_PATH = (
    Path(__file__).parent.parent.parent
    / "data"
    / "processed_driver_features.csv"
)

df = pd.read_csv(DATA_PATH)

current_index = 0


# ============================================================================
# SENSOR DATA
# ============================================================================

def get_sensor_data():

    global current_index

    row = df.iloc[current_index]

    data = {

        "timestamp": int(
            row["timestamp_offset"]
        ),

        "heart_rate": float(
            row["hr_rolling_mean"]
        ),

        "hrv": float(
            row["hr_rolling_std"]
        ),

        "gsr": float(
            row["gsr_rolling_mean"]
        ),

        "grip_pressure": 4.0,

        "skin_temperature": float(
            row["temp_rolling_mean"]
        ),

        "condition":
            "NORMAL"
            if row["condition_label"] == 0
            else "ALERT",

    }


    current_index += 1


    if current_index >= len(df):

        current_index = 0


    return data


# ============================================================================
# ECG
# ============================================================================

def generate_ecg_chunk(
    heart_rate: int,
    num_samples: int = 50
):

    bpm = max(
        40,
        min(180, heart_rate)
    )

    frequency = bpm / 60.0


    t = np.linspace(
        0,
        1 / frequency,
        num_samples
    )


    ecg = (
        0.05
        * np.sin(
            2
            * np.pi
            * frequency
            * t
        )
    )


    for i, ti in enumerate(t):

        phase = (
            ti
            * frequency
        ) % 1.0


        # P wave
        if 0.10 <= phase <= 0.20:

            ecg[i] += (
                0.15
                * math.sin(
                    np.pi
                    * (phase - 0.10)
                    / 0.10
                )
            )


        # Q wave
        elif 0.32 <= phase <= 0.35:

            ecg[i] -= 0.15


        # R wave
        elif 0.35 < phase <= 0.40:

            ecg[i] += (
                1.2
                * math.sin(
                    np.pi
                    * (phase - 0.35)
                    / 0.05
                )
            )


        # S wave
        elif 0.40 < phase <= 0.45:

            ecg[i] -= 0.25


        # T wave
        elif 0.60 <= phase <= 0.75:

            ecg[i] += (
                0.25
                * math.sin(
                    np.pi
                    * (phase - 0.60)
                    / 0.15
                )
            )


    noise = np.random.normal(
        0,
        0.02,
        num_samples
    )


    return (
        ecg + noise
    ).round(3).tolist()