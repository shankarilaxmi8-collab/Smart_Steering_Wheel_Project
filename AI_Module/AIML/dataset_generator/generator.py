import random

from AI_Module.AIML.dataset_generator.physiology import Driver
from AI_Module.AIML.dataset_generator.scenarios import SCENARIOS


def generate_driver(driver_id):

    driver = Driver()

    rows = []

    states = [
        "NORMAL",
        "WARNING",
        "CARDIAC_EVENT"
    ]

    for state in states:

        scenario = SCENARIOS[state]

        for i in range(3000):

            data = driver.update(state)

            row = {

                "heart_rate_bpm": data["heart_rate_bpm"],

                "sweat_microsiemens": data["sweat_microsiemens"],

                "skin_temp_celsius": data["skin_temp_celsius"],

                "grip_force_newton": data["grip_force_newton"],

                # ECG FEATURE ADDED
                "ecg_signal": data["ecg_signal"],

                "rr_interval_ms": data["rr_interval_ms"],

                "qrs_duration_ms": data["qrs_duration_ms"],

                "st_deviation_mv": data["st_deviation_mv"],

                "qt_interval_ms": data["qt_interval_ms"],

                "driver_id": driver_id,

                "timestamp_offset": i,

                "condition_label": scenario["label"]

            }

            rows.append(row)

    return rows