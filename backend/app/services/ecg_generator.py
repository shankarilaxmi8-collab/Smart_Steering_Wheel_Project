import math
import numpy as np

def generate_ecg_samples(heart_rate: int = 75, num_samples: int = 50) -> list[float]:
    """
    Generates a realistic PQRST ECG wave segment based on heart rate.
    """
    bpm = max(40, min(180, heart_rate))
    frequency = bpm / 60.0
    t = np.linspace(0, 1 / frequency, num_samples)
    
    ecg = 0.05 * np.sin(2 * np.pi * frequency * t)
    
    for i, ti in enumerate(t):
        phase = (ti * frequency) % 1.0
        if 0.10 <= phase <= 0.20:    # P wave
            ecg[i] += 0.15 * math.sin(np.pi * (phase - 0.10) / 0.10)
        elif 0.32 <= phase <= 0.35:  # Q wave
            ecg[i] -= 0.15
        elif 0.35 < phase <= 0.40:  # R wave (peak spike)
            ecg[i] += 1.2 * math.sin(np.pi * (phase - 0.35) / 0.05)
        elif 0.40 < phase <= 0.45:  # S wave
            ecg[i] -= 0.25
        elif 0.60 <= phase <= 0.75:  # T wave
            ecg[i] += 0.25 * math.sin(np.pi * (phase - 0.60) / 0.15)
            
    noise = np.random.normal(0, 0.02, num_samples)
    return (ecg + noise).round(3).tolist()
