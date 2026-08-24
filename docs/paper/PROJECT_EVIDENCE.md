# Project Evidence Register

**Repository assessed:** `Smart_Steering_Wheel_Project`  
**Assessment date:** 21 August 2026  
**Rule:** this register distinguishes implemented evidence from planned research. It does not treat synthetic data, prototype simulations, or unsupported documentation as clinical or on-road validation.

## Verified implementation

| Area | Evidence | What is supported |
| --- | --- | --- |
| Backend | `backend/app/main.py`, `backend/app/api/routes.py`, `backend/app/services/simulator.py` | FastAPI backend serving replayed sensor data and WebSocket-oriented dashboard integration. |
| Dashboard | `Frontend/` | React/Vite frontend with dashboard, vital signs, history, analytics, driver setup, and settings views. |
| Telemetry replay | `backend/data/processed_driver_features.csv`, `backend/app/services/simulator.py` | Rows are replayed sequentially. Fields include rolling heart-rate mean/std, rolling GSR mean, rolling temperature mean, timestamp offset, and condition label. Grip pressure is currently fixed at `4.0`. |
| Synthetic physiology | `AI_Module/AIML/dataset_generator/`, `AI_Module/simulator/sensor_generator.py`, `generated_dataset.csv` | Simulated physiological/wheel signals and scenario transitions. This is development data, not human-subject evidence. |
| Feature engineering | `AI_Module/AIML/Week2/PythonCodeFiles/preprocess_data.py` | A five-sample rolling window calculates heart-rate mean/std, GSR mean, and temperature mean. The script has a hard-coded legacy base path and needs remediation before reproducible reuse. |
| Current ML artefact | `AI_Module/prediction/predictor.py`, `AI_Module/AIML/Week3/train_model.py`, `AI_Module/models/cardiac_risk_model.joblib` | A calibrated XGBoost binary-risk artefact is trained from 9 synthetic physiological features. The predictor combines its probability with hand-written penalties and a 5-second persistence average. |
| Legacy ML artefacts | `AI_Module/AIML/Week3/model_evaluation_report.md`, `backend/app/services/predict_risk.py`, `AI_Module/models/knn_model.pkl` | Documentation also describes a Random Forest three-class report, while the backend has a separate KNN path. These are different model lines and must not be reported as one evaluated model. |
| Digital-twin MVP | `digital-twin/demo_api/`, `digital-twin/web/`, `digital-twin/tests/` | A runnable FastAPI/WebSocket/Three.js visual MVP offers steering input, repeatable normal/warning/critical scenarios and 20-Hz simulated telemetry. It explicitly does not claim physical or medical fidelity. |
| Contract | `digital-twin/contracts/driver_telemetry_v1.json` | Versioned `driver-twin.v1` JSON schema includes event time, sequence, wheel angle, HR, GSR, and risk state. |
| Production direction | `docs/DIGITAL_TWIN_REPORT.md`, `digital-twin/architecture/BLUEPRINT.md` | Proposed CARLA + ROS 2 + FastAPI + React pathway, including replay, fault injection, quality gates, and simulator-only safety boundaries. |

## Verified model details and reported metrics

`AI_Module/AIML/Week3/model_evaluation_report.md` states a **Random Forest** with four rolling features and gives an accuracy of **0.98 on 60 test samples**. The corresponding source currently found in `AI_Module/AIML/Week3/train_model.py` instead constructs a **calibrated XGBoost** model with nine raw/derived physiological features over generated data. Because the report and source do not identify a common run, dataset hash, split, commit, or model file, these metrics are retained as historical prototype documentation only. They are not paper results.

## Important limitations / evidence gaps

- No CNN vision model, face/eye data, PERCLOS extraction, or vision annotations were found.
- No context/habit data pipeline, wearable ingest, vehicle CAN ingest, lane-deviation feed, or real traffic data were found.
- No LSTM, TCN, Transformer, multi-horizon forecast, uncertainty calibration result, or physics-guided recovery model was found.
- No participant count, consent process, ground-truth protocol, real-road trial, simulator study, driver-wise split, or external validation was found.
- Labels in the available training generators are synthetic scenario labels. They do not establish disease, impairment, fatigue, or medical-event detection performance.
- The implementation contains feature/model inconsistencies: rolling replay features differ from the 9-feature KNN inference path and from the calibrated-XGBoost artefact. Resolve and version one canonical schema before any evaluation.
- Rule strings in `predictor.py` contain medical-sounding language. Product and paper wording must be changed to non-diagnostic *driver-safety risk* language unless clinical validation and regulatory work are completed.

## Baseline-paper relationship

The supplied document, *Development of a Real-Time Driver Health Detection System Using a Smart Steering Wheel*, is treated as **prior work only**. The user-provided summary identifies it as a laboratory smart-wheel system based on respiration, grip force, PPG, ECG, reference-range thresholds, and possible arrhythmia flags. The present project must cite it rather than represent it as its own method or result. The intended distinction is: a safety-oriented, personalised, multimodal, uncertainty-aware prediction research programme; its implementation is currently an early physiological/digital-twin prototype.

## Claim-safe language

Use: “prototype risk estimate,” “synthetic scenario,” “planned evaluation,” “non-diagnostic decision support,” and “simulator-only demonstrator.”

Avoid: “detects cardiac events,” “diagnoses arrhythmia,” “prevents accidents,” “real-time validated,” “accurate fatigue prediction,” or any performance claim without a reproducible experiment.
