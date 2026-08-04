class ECGSensor:

    def read(self, state):

        if state == "NORMAL":
            return "NORMAL"

        if state == "WARNING":
            return "ST_ELEVATION"

        if state == "CARDIAC_EVENT":
            return "ARRHYTHMIA"

        return "NORMAL"