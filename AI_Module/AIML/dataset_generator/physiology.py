import random

class Driver:

    def __init__(self):

        self.heart_rate = 74.0
        self.gsr = 3.2
        self.temperature = 33.6
        self.grip = 16.0

        self.rr = 810
        self.qrs = 92
        self.st = 0.01
        self.qt = 390

    def update(self, state):

        if state == "NORMAL":

            self.heart_rate += random.uniform(-0.4,0.4)

            self.gsr += random.uniform(-0.03,0.03)

            self.temperature += random.uniform(-0.02,0.02)

            self.grip += random.uniform(-0.1,0.1)

            self.rr += random.uniform(-4,4)

            self.qrs += random.uniform(-1,1)

            self.st += random.uniform(-0.005,0.005)

            self.qt += random.uniform(-2,2)

        elif state == "WARNING":

            self.heart_rate += random.uniform(0.2,0.8)

            self.gsr += random.uniform(0.03,0.08)

            self.temperature -= random.uniform(0.00,0.03)

            self.grip -= random.uniform(0.02,0.08)

            self.rr -= random.uniform(2,6)

            self.qrs += random.uniform(0,1)

            self.st += random.uniform(0.002,0.008)

            self.qt += random.uniform(0,2)

        elif state == "CARDIAC_EVENT":

            self.heart_rate += random.uniform(0.4,1.2)

            self.gsr += random.uniform(0.08,0.15)

            self.temperature -= random.uniform(0.02,0.06)

            self.grip -= random.uniform(0.05,0.15)

            self.rr -= random.uniform(3,8)

            self.qrs += random.uniform(0.5,2)

            self.st += random.uniform(0.005,0.015)

            self.qt += random.uniform(1,4)

        return {

            "heart_rate_bpm": round(self.heart_rate,2),

            "sweat_microsiemens": round(self.gsr,2),

            "skin_temp_celsius": round(self.temperature,2),

            "grip_force_newton": round(self.grip,2),

            "rr_interval_ms": round(self.rr,2),

            "qrs_duration_ms": round(self.qrs,2),

            "st_deviation_mv": round(self.st,3),

            "qt_interval_ms": round(self.qt,2)

        }