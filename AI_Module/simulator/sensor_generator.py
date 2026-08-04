from AIML.dataset_generator.physiology import Driver


class SensorGenerator:

    def __init__(self):
        self.driver = Driver()

    def generate(self, state="NORMAL"):
        """
        Generate one set of physiological sensor readings.

        Parameters
        ----------
        state : str
            NORMAL
            WARNING
            CARDIAC_EVENT
        """

        return self.driver.update(state)