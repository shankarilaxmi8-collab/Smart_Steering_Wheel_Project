import pandas as pd
from pathlib import Path

# Path to dataset
DATA_PATH = Path(__file__).parent.parent.parent / "data" / "processed_driver_features.csv"

# Load dataset
df = pd.read_csv(DATA_PATH)

# Keeps track of the current row
current_index = 0

def get_sensor_data():
    global current_index

    row = df.iloc[current_index]

    data = {
        "timestamp": int(row["timestamp_offset"]),
        "heart_rate": float(row["hr_rolling_mean"]),
        "hrv": float(row["hr_rolling_std"]),
        "gsr": float(row["gsr_rolling_mean"]),
        "grip_pressure": 4.0,
        "skin_temperature": float(row["temp_rolling_mean"]),
        "condition": "NORMAL" if row["condition_label"] == 0 else "ALERT"
    }

    current_index += 1

    if current_index >= len(df):
        current_index = 0

    return data