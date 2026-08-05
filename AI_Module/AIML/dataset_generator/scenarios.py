SCENARIOS = {

    "NORMAL": {

        "label": 0,

        "heart_rate": (68, 80),

        "gsr": (3.0, 3.5),

        "temperature": (33.4, 33.8),

        "grip": (14, 18),

        "rr": (750, 900),

        "qrs": (80, 100),

        "st": (-0.05, 0.05),

        "qt": (360, 420)

    },


    "WARNING": {

        "label": 1,

        "heart_rate": (80, 95),

        "gsr": (3.8, 5.5),

        "temperature": (32.8, 33.3),

        "grip": (10, 14),

        "rr": (650, 750),

        "qrs": (95, 110),

        "st": (0.05, 0.20),

        "qt": (390, 450)

    },


    "CARDIAC_EVENT": {

        "label": 2,

        "heart_rate": (95, 130),

        "gsr": (6.0, 14.0),

        "temperature": (28.5, 32.5),

        "grip": (3, 9),

        "rr": (450, 650),

        "qrs": (110, 150),

        "st": (0.20, 0.60),

        "qt": (430, 520)

    }

}