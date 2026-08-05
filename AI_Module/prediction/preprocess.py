import joblib
import pandas as pd


MODEL_SCALER = "AI_Module/models/scaler.pkl"


scaler = joblib.load(MODEL_SCALER)


FEATURE_ORDER = [

    "heart_rate_bpm",

    "sweat_microsiemens",

    "skin_temp_celsius",

    "grip_force_newton",

    "ecg_signal",

    "rr_interval_ms",

    "qrs_duration_ms",

    "st_deviation_mv",

    "qt_interval_ms"

]


def prepare_features(sensor_data):

    df = pd.DataFrame(
        [sensor_data]
    )


    df = df[FEATURE_ORDER]


    return df



def preprocess(sensor_data):

    features = prepare_features(sensor_data)


    scaled_features = scaler.transform(
        features
    )


    return scaled_features