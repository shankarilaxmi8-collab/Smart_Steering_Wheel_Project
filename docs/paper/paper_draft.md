# A Digital-Twin Prototype for Personalised, Multimodal Driver-Safety Risk Prediction: Architecture, Evidence Gaps, and Evaluation Protocol

## Abstract

Driver monitoring systems often interpret individual physiological measurements using generic thresholds, despite substantial variation caused by activity, environment, and driver baseline. This paper presents the architecture and current evidence base of a smart-steering-wheel driver-safety research prototype. The implemented system combines simulated/replayed physiological telemetry, a Python inference component, a FastAPI backend, a React dashboard, and a browser-based digital twin with versioned telemetry. It is explicitly a non-diagnostic, simulator-oriented prototype. We propose an extension to context-aware multimodal forecasting that would combine eye/face features, wheel/physiology measurements, driver behaviour, and contextual information through temporal fusion. Its central hypothesis is that risk should depend on deviations from an expected, personalised recovery trajectory rather than universal physiological cut-offs. A planned evaluation protocol uses driver-wise splits, multi-horizon outcomes, calibration, ablation, and sensor-failure testing. Repository inspection shows that the current implementation does not yet include vision, context/habit modelling, temporal forecasting, real-driver validation, or clinical validation. Accordingly, this work contributes a reproducible prototype boundary and research protocol, not a claim of fatigue, cardiac, or medical-event detection accuracy.

**Keywords:** driver monitoring; smart steering wheel; digital twin; multimodal fusion; uncertainty; safety decision support

## 1. Introduction

Driver fatigue, distraction, stress, and unexpected physiological changes can degrade safe driving. Steering-wheel sensing is attractive because it can capture interaction and selected physiological signals without requiring a separate wearable. However, a high heart rate, sweating, or altered grip is not by itself a universal risk indicator: exercise, heat, traffic, individual conditioning, and measurement artefacts can produce similar readings.

The supplied baseline paper, *Development of a Real-Time Driver Health Detection System Using a Smart Steering Wheel*, motivates this work through its wheel-based respiration, grip-force, PPG, and ECG sensing approach. Based on the supplied summary, its decision logic relies on reference ranges and laboratory validation. This project is distinct: it does not reproduce that threshold detector or claim medical diagnosis. It proposes an evidence-seeking path toward personalised, context-aware, uncertainty-aware **driver-safety risk** prediction.

## 2. System boundary and related work position

The project is a decision-support research prototype. It must not command a road vehicle, diagnose disease, or substitute for medical care. Its output is limited to a graded safety-risk estimate, data-quality status, explanation codes, and an optional alert for a human driver/operator.

The baseline smart-wheel paper is cited as prior work, not as a result of this project. Literature review in a submission version should additionally cover validated vision-based drowsiness measures, physiological signal quality, multimodal driver monitoring, calibrated uncertainty, privacy-preserving in-vehicle sensing, and simulation/HIL verification. Each reference must be verified from the original source before submission.

## 3. Implemented prototype

The repository contains a FastAPI backend, a React/Vite dashboard, synthetic physiology generators, telemetry replay, and a browser-based digital twin. The replay backend reads rolling heart-rate, GSR, and skin-temperature features from a CSV and adds a fixed grip-pressure value. A separate inference line stores a calibrated XGBoost artefact trained from generated nine-feature physiological samples; another legacy path contains KNN and Random Forest documentation. These model lines are not yet harmonised.

The digital-twin MVP streams simulated telemetry over WebSocket at 20 Hz and renders a controllable 3D driving scene. It offers repeatable normal/warning/critical scenarios. A JSON Schema called `driver-twin.v1` establishes a starting contract for event time, sequence, wheel angle, heart rate, GSR, and risk state. The project blueprint proposes a later ROS 2/CARLA architecture for replay, vehicle integration, recording, and fault injection.

## 4. Proposed multimodal method

### 4.1 Inputs

The intended system has four synchronised branches:

- **Vision:** eye closure, blink dynamics, PERCLOS, yawn cues, head pose, and fatigue-related facial features.
- **Physiology and wheel interaction:** heart rate, HRV, respiration, EDA/GSR, temperature, grip/contact quality, and optional oxygen-saturation or BP-proxy data only when sensor validity is established.
- **Context and habit:** sleep/activity self-report, post-exercise interval, usual commute window, medication self-report only with explicit consent and minimisation, traffic, cabin temperature, road type, and time of day.
- **Driving behaviour:** steering variability, braking, speed variation, lane offset/deviation, and relevant simulator/vehicle events.

### 4.2 Temporal fusion and personalisation

For a driver (d), context (c_t), and physiological observation (x_t), a personal baseline module estimates an expected state:

\[
\hat{x}_t = g_d(c_{0:t}, x_{0:t-1}).
\]

The fusion model consumes the residual (r_t=x_t-\hat{x}_t), raw measurements, quality indicators, vision and driving features, and a missing-modality mask. A TCN, LSTM, or compact Transformer is a candidate implementation; model selection must be empirical. The output estimates present risk and risk at 5, 10, and 15 minutes, together with calibrated uncertainty and reason codes.

The proposed physics-guided layer is a set of soft plausibility and recovery constraints, not a medical model or universal normal range. It should encode bounded rate of change, sensor contact validity, temporal recovery after reported activity, and uncertainty escalation when modalities disagree. It must allow personalised learning rather than assume every driver recovers in the same way.

### 4.3 Alert policy

The alert policy consumes risk, uncertainty, persistence, and data quality. When quality is insufficient, it returns `UNKNOWN`/defer rather than a confident risk assertion. Alerts are graded, rate-limited, logged, and require human acknowledgement; no autonomous vehicle intervention is part of this work.

## 5. Digital-twin framework

The runnable MVP provides repeatable synthetic scenarios for integration testing. The production target uses a wheel gateway, ROS 2 fusion and inference nodes, CARLA vehicle/scene telemetry, an API adapter, persistent logs, and replayable scenarios. Its role is to test time alignment, sensor loss, alert policy, latency, and integration behaviour. It cannot establish real-world driver or health performance without representative data and human-subject evaluation.

## 6. Evaluation protocol

Data will be partitioned by driver and trip, not randomly by adjacent frames or rolling windows. A population model is trained on one set of drivers, validated on separate drivers, and tested on held-out drivers. If personal adaptation is examined, a strictly earlier calibration period is declared and excluded from test scoring.

Baselines include vision-only, physiology/context-only, unconstrained fusion, and the full proposed system. Ablations remove context/habit information and each sensor modality. Metrics include sensitivity, specificity, macro F1, AUROC/AUPRC where appropriate, Brier score and expected calibration error, false alerts per driving hour, alert lead time, system latency, and abstention coverage. Scenario tests inject hand-contact loss, noisy optical/EDA signals, missing camera, lighting shifts, traffic changes, and post-exercise recovery contexts.

## 7. Current findings and limitations

The current evidence supports only a software prototype: telemetry replay, simulated signals/scenarios, an initial risk-inference implementation, a digital-twin demonstration, and an architecture for future evolution. A legacy report gives high performance on a small synthetic test set, but its model and feature specification conflict with other repository files; it is therefore not a valid reported result.

The repository has no verified CNN vision branch, no real driving-behaviour or context dataset, no temporal prediction study, no human-subject data, no calibrated uncertainty evaluation, and no clinical/real-road validation. Synthetic labels do not establish medical, fatigue, or crash-risk accuracy. These limitations are central, not incidental.

## 8. Ethics, privacy, and governance

Physiological and facial data are sensitive. Future data collection requires the appropriate institutional review, informed consent, data minimisation, separation of identifiers from telemetry, encryption in transit and at rest, role-based access, retention/deletion rules, and documented sharing restrictions. Medication, health, and activity inputs must be optional and purpose-limited. The system should avoid demographic inference not required for safety research and assess sensing quality/fairness across relevant conditions.

## 9. Conclusion

This project establishes a practical software and digital-twin base for future multimodal driver-safety research. Its novel direction is to judge observations relative to personalised, context-dependent expected trajectories and to defer when data are unreliable. The next valid contribution is not an unsupported accuracy claim: it is a reproducible data protocol, a unified feature/model contract, temporal and multimodal implementation, and driver-wise evaluation under realistic and fault-injected conditions.

## References

1. *Development of a Real-Time Driver Health Detection System Using a Smart Steering Wheel.* User-supplied PDF, accessed 21 August 2026. Complete authors, venue, year, and DOI must be verified from the document before submission.
2. Additional peer-reviewed references: to be added after a source-verified literature review.
