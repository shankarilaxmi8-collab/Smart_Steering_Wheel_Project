import random
from physiology import Driver

STATES = [

    ("NORMAL", 180),

    ("WARNING", 40),

    ("CARDIAC_EVENT", 80)

]


def generate_driver(driver_id):

    driver = Driver()

    rows = []

    timestamp = 0

    for state, duration in STATES:

        for _ in range(duration):

            values = driver.update(state)

            values["driver_id"] = driver_id

            values["timestamp_offset"] = timestamp

            values["condition_label"] = {

                "NORMAL":0,

                "WARNING":1,

                "CARDIAC_EVENT":2

            }[state]

            rows.append(values)

            timestamp += 1

    return rows