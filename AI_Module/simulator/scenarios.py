class DriverScenario:

    def __init__(self):

        self.counter = 0

    def current_state(self):

        self.counter += 1

        if self.counter <= 20:
            return "NORMAL"

        elif self.counter <= 35:
            return "WARNING"

        elif self.counter <= 55:
            return "CARDIAC_EVENT"

        else:
            self.counter = 0
            return "NORMAL"