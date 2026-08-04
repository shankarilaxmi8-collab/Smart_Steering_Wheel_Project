import random


def gaussian_noise(value, std_dev):
    """
    Adds Gaussian noise to a sensor reading.
    """
    return value + random.gauss(0, std_dev)


def uniform_noise(value, variation):
    """
    Adds uniform random variation.
    """
    return value + random.uniform(-variation, variation)


def clip(value, minimum, maximum):
    """
    Keeps a value inside a valid range.
    """
    return max(minimum, min(value, maximum))


def noisy_heart_rate(value):
    value = gaussian_noise(value, 0.8)
    return round(clip(value, 40, 200), 2)


def noisy_gsr(value):
    value = gaussian_noise(value, 0.08)
    return round(clip(value, 0.5, 20), 2)


def noisy_temperature(value):
    value = gaussian_noise(value, 0.03)
    return round(clip(value, 28, 38), 2)


def noisy_grip(value):
    value = gaussian_noise(value, 0.2)
    return round(clip(value, 0, 40), 2)


def noisy_rr(value):
    value = gaussian_noise(value, 4)
    return round(clip(value, 300, 1500), 2)


def noisy_qrs(value):
    value = gaussian_noise(value, 1.2)
    return round(clip(value, 60, 180), 2)


def noisy_st(value):
    value = gaussian_noise(value, 0.002)
    return round(clip(value, -0.3, 0.5), 3)


def noisy_qt(value):
    value = gaussian_noise(value, 3)
    return round(clip(value, 250, 600), 2)