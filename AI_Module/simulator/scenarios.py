# simulator/scenarios.py

SCENARIOS = {
    "NORMAL": {
        "heart_rate": (65, 85),
        "temperature": (36.5, 37.0),
        "gsr": (250, 450),
        "ecg": 0
    },

    "STRESS": {
        "heart_rate": (90, 115),
        "temperature": (36.8, 37.3),
        "gsr": (500, 750),
        "ecg": 1
    },

    "FATIGUE": {
        "heart_rate": (55, 70),
        "temperature": (36.2, 36.6),
        "gsr": (180, 350),
        "ecg": 0
    },

    "CARDIAC_EVENT": {
        "heart_rate": (120, 150),
        "temperature": (35.2, 36.0),
        "gsr": (900, 1200),
        "ecg": 2
    }
}