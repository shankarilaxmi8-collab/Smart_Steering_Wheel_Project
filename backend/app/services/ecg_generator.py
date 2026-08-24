import math
import numpy as np


def generate_ecg_chunk(
    heart_rate: float,
    num_samples: int = 50,
    sample_rate: int = 250,
    phase_offset: float = 0.0,
):
    """
    Generate a continuous synthetic ECG chunk.

    250 Hz sampling rate
    50 samples = 0.2 seconds of ECG
    """

    bpm = max(
        40.0,
        min(180.0, float(heart_rate))
    )

    frequency = bpm / 60.0

    # 50 samples at 250 Hz = 0.2 seconds
    t = np.arange(num_samples) / sample_rate

    phase = (
        phase_offset
        + t * frequency
    ) % 1.0

    ecg = (
        0.015
        * np.sin(
            2 * np.pi * frequency * t
        )
    )

    for i, p in enumerate(phase):

        # --------------------------------------------------
        # P wave
        # --------------------------------------------------

        if 0.10 <= p <= 0.20:

            ecg[i] += (
                0.12
                * math.sin(
                    np.pi
                    * (p - 0.10)
                    / 0.10
                )
            )


        # --------------------------------------------------
        # Q wave
        # --------------------------------------------------

        elif 0.32 <= p <= 0.35:

            ecg[i] -= 0.12


        # --------------------------------------------------
        # R wave
        # --------------------------------------------------

        elif 0.35 < p <= 0.40:

            ecg[i] += (
                1.0
                * math.sin(
                    np.pi
                    * (p - 0.35)
                    / 0.05
                )
            )


        # --------------------------------------------------
        # S wave
        # --------------------------------------------------

        elif 0.40 < p <= 0.45:

            ecg[i] -= 0.20


        # --------------------------------------------------
        # T wave
        # --------------------------------------------------

        elif 0.60 <= p <= 0.75:

            ecg[i] += (
                0.20
                * math.sin(
                    np.pi
                    * (p - 0.60)
                    / 0.15
                )
            )


    noise = np.random.normal(
        0,
        0.01,
        num_samples
    )

    return (
        ecg + noise
    ).round(3).tolist()