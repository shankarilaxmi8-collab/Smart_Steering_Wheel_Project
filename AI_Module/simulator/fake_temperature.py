import random


class TemperatureSensor:

    def __init__(self):
        self.value = 33.6

    def read(self, state):

        if state == "NORMAL":

            self.value += random.uniform(-0.02, 0.02)

            self.value = max(33.4, min(self.value, 33.8))

        elif state == "WARNING":

            self.value -= random.uniform(0.00, 0.03)

            self.value = max(32.8, min(self.value, 33.3))

        elif state == "CARDIAC_EVENT":

            self.value -= random.uniform(0.02, 0.06)

            self.value = max(28.5, min(self.value, 32.5))

        return round(self.value, 2)