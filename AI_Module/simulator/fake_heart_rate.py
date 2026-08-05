import random


class HeartRateSensor:

    def __init__(self):
        self.value = 74.0

    def read(self, state):

        if state == "NORMAL":

            self.value += random.uniform(-0.4, 0.4)

            self.value = max(68, min(self.value, 80))

        elif state == "WARNING":

            self.value += random.uniform(0.3, 0.8)

            self.value = max(80, min(self.value, 95))

        elif state == "CARDIAC_EVENT":

            self.value += random.uniform(0.6, 1.4)

            self.value = max(95, min(self.value, 130))

        return round(self.value, 2)