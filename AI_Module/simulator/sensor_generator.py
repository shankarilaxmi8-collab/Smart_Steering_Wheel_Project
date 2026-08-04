import time
import random

from AI_Module.AIML.dataset_generator.physiology import Driver


driver = Driver()


def get_state(second):
    """
    Change driver's condition over time.
    """

    if second < 15:
        return "NORMAL"

    elif second < 30:
        return "WARNING"

    else:
        return "CARDIAC_EVENT"


print("=" * 60)
print("SMART STEERING WHEEL SENSOR SIMULATOR")
print("=" * 60)

counter = 0

while True:

    state = get_state(counter)

    data = driver.update(state)

    print("\n------------------------------")
    print(f"Time : {counter:03d} sec")
    print(f"State: {state}")
    print("------------------------------")

    print(f"Heart Rate : {data['heart_rate_bpm']} BPM")
    print(f"GSR        : {data['sweat_microsiemens']} µS")
    print(f"Skin Temp  : {data['skin_temp_celsius']} °C")
    print(f"Grip Force : {data['grip_force_newton']} N")

    print("\nECG Features")

    print(f"RR Interval : {data['rr_interval_ms']} ms")
    print(f"QRS Duration: {data['qrs_duration_ms']} ms")
    print(f"ST Deviation: {data['st_deviation_mv']} mV")
    print(f"QT Interval : {data['qt_interval_ms']} ms")

    counter += 1

    time.sleep(1)