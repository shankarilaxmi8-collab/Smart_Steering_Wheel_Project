import os
from pathlib import Path
from collections import deque

import joblib


# ============================================================================
# PATHS
# ============================================================================

BASE_DIR = Path(__file__).resolve().parents[2]

MODEL_PATH = BASE_DIR / "models" / "knn_model.pkl"
SCALER_PATH = BASE_DIR / "models" / "scaler.pkl"


# ============================================================================
# CARDIAC INFERENCE ENGINE
# ============================================================================

class CardiacInferenceEngine:

    def __init__(
        self,
        model=None,
        scaler=None,
        buffer_size=3,
    ):

        # --------------------------------------------------------------------
        # LOAD MODEL
        # --------------------------------------------------------------------

        if model is None:

            if not MODEL_PATH.exists():

                print(
                    f"❌ Model not found at: {MODEL_PATH}"
                )

            else:

                model = joblib.load(
                    MODEL_PATH
                )

                print(
                    f"✅ Model loaded from: {MODEL_PATH}"
                )


        # --------------------------------------------------------------------
        # LOAD SCALER
        # --------------------------------------------------------------------

        if scaler is None:

            if not SCALER_PATH.exists():

                print(
                    f"❌ Scaler not found at: {SCALER_PATH}"
                )

            else:

                scaler = joblib.load(
                    SCALER_PATH
                )

                print(
                    f"✅ Scaler loaded from: {SCALER_PATH}"
                )


        self.model = model

        self.scaler = scaler


        # --------------------------------------------------------------------
        # STABILIZATION
        # --------------------------------------------------------------------

        self.buffer_size = buffer_size

        self.history = deque(
            maxlen=buffer_size
        )


        # --------------------------------------------------------------------
        # DEFAULT STATE
        # --------------------------------------------------------------------

        self.stable_state = None


        # --------------------------------------------------------------------
        # FALLBACK LABEL MAP
        # --------------------------------------------------------------------

        self.labels = {

            0: "NORMAL",

            1: "WARNING",

            2: "CARDIAC_EVENT",

        }


        # --------------------------------------------------------------------
        # MODEL INFORMATION
        # --------------------------------------------------------------------

        if self.model is not None:

            print(
                "\n========== MODEL INFORMATION =========="
            )

            print(
                "Model:",
                type(self.model).__name__
            )

            print(
                "Model classes:",
                getattr(
                    self.model,
                    "classes_",
                    "UNKNOWN"
                )
            )

            print(
                "Expected features:",
                getattr(
                    self.model,
                    "n_features_in_",
                    "UNKNOWN"
                )
            )

            print(
                "=======================================\n"
            )


    # =========================================================================
    # LABEL NORMALIZATION
    # =========================================================================

    def normalize_label(
        self,
        label,
    ):

        """
        Convert the model's actual class label into the dashboard label.

        Supports:

            0 -> NORMAL
            1 -> WARNING
            2 -> CARDIAC_EVENT

        Also supports string labels directly.
        """

        # --------------------------------------------------------------------
        # INTEGER LABEL
        # --------------------------------------------------------------------

        try:

            numeric_label = int(label)

            if numeric_label in self.labels:

                return self.labels[
                    numeric_label
                ]

        except (
            TypeError,
            ValueError,
        ):

            pass


        # --------------------------------------------------------------------
        # STRING LABEL
        # --------------------------------------------------------------------

        normalized = str(
            label
        ).strip().upper()


        if normalized in (
            "NORMAL",
            "0",
        ):

            return "NORMAL"


        if normalized in (
            "WARNING",
            "WARN",
            "1",
        ):

            return "WARNING"


        if normalized in (
            "CARDIAC_EVENT",
            "CARDIAC",
            "CRITICAL",
            "EMERGENCY",
            "2",
        ):

            return "CARDIAC_EVENT"


        # --------------------------------------------------------------------
        # UNKNOWN
        # --------------------------------------------------------------------

        return normalized


    # =========================================================================
    # PROCESS SAMPLE
    # =========================================================================

    def process_sample(
        self,
        sensor,
    ):

        # --------------------------------------------------------------------
        # MODEL NOT AVAILABLE
        # --------------------------------------------------------------------

        if (
            self.model is None
            or self.scaler is None
        ):

            return {

                "raw_prediction":
                    "NORMAL",

                "stable_prediction":
                    "NORMAL",

                "confidence":
                    0.0,

                "buffer":
                    [],

            }


        # --------------------------------------------------------------------
        # CONVERT LIST / TUPLE TO DICTIONARY
        # --------------------------------------------------------------------

        if isinstance(
            sensor,
            (list, tuple)
        ):

            sensor = {

                "heart_rate_bpm":
                    sensor[0]
                    if len(sensor) > 0
                    else 75,

                "sweat_microsiemens":
                    sensor[1]
                    if len(sensor) > 1
                    else 3.0,

                "grip_force_newton":
                    sensor[2]
                    if len(sensor) > 2
                    else 16.0,

                "skin_temp_celsius":
                    sensor[3]
                    if len(sensor) > 3
                    else 33.5,

                "ecg_signal":
                    sensor[4]
                    if len(sensor) > 4
                    else 0.0,

                "rr_interval_ms":
                    sensor[5]
                    if len(sensor) > 5
                    else 800.0,

                "qrs_duration_ms":
                    sensor[6]
                    if len(sensor) > 6
                    else 90.0,

                "st_deviation_mv":
                    sensor[7]
                    if len(sensor) > 7
                    else 0.01,

                "qt_interval_ms":
                    sensor[8]
                    if len(sensor) > 8
                    else 390.0,

            }


        # =========================================================================
        # FEATURE EXTRACTION
        # =========================================================================
        #
        # IMPORTANT:
        #
        # THIS ORDER MUST MATCH THE ORDER USED DURING MODEL TRAINING.
        #
        # We will verify this next using train_knn.py.
        #
        # =========================================================================

        features = [[

            sensor.get(
                "heart_rate_bpm",
                sensor.get(
                    "heart_rate",
                    74.0
                )
            ),

            sensor.get(
                "sweat_microsiemens",
                sensor.get(
                    "gsr",
                    3.2
                )
            ),

            sensor.get(
                "skin_temp_celsius",
                sensor.get(
                    "skin_temperature",
                    33.6
                )
            ),

            sensor.get(
                "grip_force_newton",
                sensor.get(
                    "grip_pressure",
                    16.0
                )
            ),

            sensor.get(
                "ecg_signal",
                0.02
            ),

            sensor.get(
                "rr_interval_ms",
                810.0
            ),

            sensor.get(
                "qrs_duration_ms",
                91.0
            ),

            sensor.get(
                "st_deviation_mv",
                0.01
            ),

            sensor.get(
                "qt_interval_ms",
                392.0
            ),

        ]]


        # =========================================================================
        # FEATURE COUNT CHECK
        # =========================================================================

        expected_features = getattr(
            self.model,
            "n_features_in_",
            None
        )


        if (
            expected_features is not None
            and expected_features != len(features[0])
        ):

            raise ValueError(

                "❌ Feature count mismatch!\n"

                f"Model expects: "
                f"{expected_features}\n"

                f"Frontend provides: "
                f"{len(features[0])}"

            )


        # =========================================================================
        # DEBUG RAW FEATURES
        # =========================================================================

        print(
            "\n========== MODEL INPUT =========="
        )

        print(
            "Features:",
            features[0]
        )

        print(
            "Feature count:",
            len(features[0])
        )

        print(
            "================================\n"
        )


        # =========================================================================
        # SCALE
        # =========================================================================

        scaled = self.scaler.transform(
            features
        )


        # =========================================================================
        # MODEL PREDICTION
        # =========================================================================

        model_prediction = self.model.predict(
            scaled
        )[0]


        # =========================================================================
        # MODEL CLASSES
        # =========================================================================

        model_classes = getattr(
            self.model,
            "classes_",
            None
        )


        # =========================================================================
        # NORMALIZED PREDICTION
        # =========================================================================

        prediction_label = self.normalize_label(
            model_prediction
        )


        # =========================================================================
        # PROBABILITIES
        # =========================================================================

        probabilities = self.model.predict_proba(
            scaled
        )[0]


        # =========================================================================
        # FIND CONFIDENCE USING MODEL CLASS INDEX
        # =========================================================================

        confidence = 0.0


        if model_classes is not None:

            for index, model_class in enumerate(
                model_classes
            ):

                if model_class == model_prediction:

                    confidence = (
                        float(
                            probabilities[index]
                        )
                        * 100
                    )

                    break

        else:

            # Fallback only if model.classes_ doesn't exist.

            try:

                confidence = (
                    float(
                        probabilities[
                            int(model_prediction)
                        ]
                    )
                    * 100
                )

            except (
                IndexError,
                TypeError,
                ValueError,
            ):

                confidence = 0.0


        # =========================================================================
        # UPDATE HISTORY
        # =========================================================================

        self.history.append(
            prediction_label
        )


        # =========================================================================
        # STABILIZATION
        # =========================================================================
        #
        # IMPORTANT:
        #
        # The previous code initialized stable_state = 0.
        #
        # That means the system assumes NORMAL even before
        # receiving enough predictions.
        #
        # We now explicitly wait until the buffer is full.
        #
        # =========================================================================

        if len(
            self.history
        ) == self.buffer_size:

            if all(
                item == prediction_label
                for item in self.history
            ):

                self.stable_state = (
                    prediction_label
                )


        # =========================================================================
        # STABLE FALLBACK
        # =========================================================================

        stable_prediction = (

            self.stable_state

            if self.stable_state is not None

            else "NORMAL"

        )


        # =========================================================================
        # DEBUG
        # =========================================================================

        print(
            "========== AI RESULT =========="
        )

        print(
            "Raw model class:",
            model_prediction
        )

        print(
            "Model classes:",
            model_classes
        )

        print(
            "Raw prediction:",
            prediction_label
        )

        print(
            "Probability vector:",
            probabilities
        )

        print(
            "Confidence:",
            round(
                confidence,
                2
            ),
            "%"
        )

        print(
            "History:",
            list(
                self.history
            )
        )

        print(
            "Stable prediction:",
            stable_prediction
        )

        print(
            "===============================\n"
        )


        # =========================================================================
        # RETURN
        # =========================================================================

        return {

            "raw_prediction":
                prediction_label,

            "stable_prediction":
                stable_prediction,

            "confidence":
                round(
                    confidence,
                    2
                ),

            "buffer":
                list(
                    self.history
                ),

        }


# =============================================================================
# GLOBAL ENGINE INSTANCE
# =============================================================================

engine = CardiacInferenceEngine()


# =============================================================================
# FASTAPI WRAPPER
# =============================================================================

def predict_risk(
    sensor_data
):

    """
    Main inference function called by FastAPI / ROS bridge.
    """

    result = engine.process_sample(
        sensor_data
    )


    return {

        "raw_prediction":
            result[
                "raw_prediction"
            ],

        "stabilized_prediction":
            result[
                "stable_prediction"
            ],

        "confidence":
            result[
                "confidence"
            ],

    }


# =============================================================================
# MANUAL TEST
# =============================================================================

if __name__ == "__main__":

    print(
        "Loading Cardiac Inference Engine...\n"
    )


    samples = [

        {

            "heart_rate_bpm":
                74,

            "sweat_microsiemens":
                3.2,

            "skin_temp_celsius":
                33.6,

            "grip_force_newton":
                16,

            "ecg_signal":
                0.02,

            "rr_interval_ms":
                810,

            "qrs_duration_ms":
                91,

            "st_deviation_mv":
                0.01,

            "qt_interval_ms":
                392,

        },

        {

            "heart_rate_bpm":
                121,

            "sweat_microsiemens":
                12.6,

            "skin_temp_celsius":
                29.5,

            "grip_force_newton":
                4,

            "ecg_signal":
                0.46,

            "rr_interval_ms":
                515,

            "qrs_duration_ms":
                136,

            "st_deviation_mv":
                0.48,

            "qt_interval_ms":
                481,

        },

    ]


    print(
        "========== INFERENCE RESULTS ==========\n"
    )


    for i, sample in enumerate(
        samples,
        start=1
    ):

        print(
            f"Sample {i}"
        )


        result = engine.process_sample(
            sample
        )


        print(
            result
        )


        print(
            "-" * 50
        )