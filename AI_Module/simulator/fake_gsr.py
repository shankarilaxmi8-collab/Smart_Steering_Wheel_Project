import random


class GSRSensor:

    def __init__(self):
        self.value = 3.2

    def read(self, state):

        if state == "NORMAL":

            self.value += random.uniform(-0.03, 0.03)

            self.value = max(3.0, min(self.value, 3.5))

        elif state == "WARNING":

            self.value += random.uniform(0.05, 0.15)

            self.value = max(3.8, min(self.value, 5.5))

        elif state == "CARDIAC_EVENT":

            self.value += random.uniform(0.10, 0.30)

            self.value = max(6.0, min(self.value, 14.0))

        return round(self.value, 2)