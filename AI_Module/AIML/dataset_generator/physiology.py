import random

from AI_Module.AIML.dataset_generator.scenarios import SCENARIOS


class Driver:

    def __init__(self):
        pass

    def update(self, state):

        scenario = SCENARIOS[state]

        # ECG values depend on driver's condition
        if state == "NORMAL":
            ecg = random.uniform(-0.03, 0.03)

        elif state == "WARNING":
            ecg = random.uniform(0.05, 0.18)

        else:  # CARDIAC_EVENT
            ecg = random.uniform(0.20, 0.55)

        return {

            "heart_rate_bpm": round(
                random.uniform(*scenario["heart_rate"]), 2
            ),

            "sweat_microsiemens": round(
                random.uniform(*scenario["gsr"]), 2
            ),

            "skin_temp_celsius": round(
                random.uniform(*scenario["temperature"]), 2
            ),

            "grip_force_newton": round(
                random.uniform(*scenario["grip"]), 2
            ),

            "ecg_signal": round(
                ecg, 4
            ),

            "rr_interval_ms": round(
                random.uniform(*scenario["rr"]), 2
            ),

            "qrs_duration_ms": round(
                random.uniform(*scenario["qrs"]), 2
            ),

            "st_deviation_mv": round(
                random.uniform(*scenario["st"]), 3
            ),

            "qt_interval_ms": round(
                random.uniform(*scenario["qt"]), 2
            )

        }