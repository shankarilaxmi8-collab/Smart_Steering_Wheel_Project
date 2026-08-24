# Paper Outline

## Proposed title

**A Digital-Twin Prototype for Personalised, Multimodal Driver-Safety Risk Prediction: Architecture, Evidence Gaps, and Evaluation Protocol**

This title is intentionally accurate for the current repository. “Physics-Guided Multimodal AI for Context-Aware Prediction of Driver Fatigue and Physiological Risk” may be used only after its vision, context, temporal, and physics-guided components are implemented and evaluated.

## Research question

Can a modular smart-wheel and digital-twin architecture support future personalised, non-diagnostic prediction of driver-safety risk while explicitly handling context, signal quality, uncertainty, and sensor loss?

## Paper structure

1. **Abstract** — architecture/prototype contribution, not validated health performance.
2. **Introduction** — limits of fixed physiological thresholds and the need for context-aware safety assistance.
3. **Related Work** — smart-wheel sensing baseline; vision, physiology, driving behaviour, multimodal fusion, uncertainty, and digital-twin research. Cite the supplied paper as prior work.
4. **System Boundary and Safety Position** — decision support only; no medical diagnosis or vehicle actuation.
5. **Implemented Prototype** — sensor replay, FastAPI/React, synthetic risk predictor, Three.js twin, versioned telemetry contract.
6. **Target Multimodal Method** — proposed CNN vision, physiology, context/habit, driving behaviour, temporal fusion, personalised recovery residuals, uncertainty and explanations. Mark all as proposed except existing physiology/twin elements.
7. **Digital-Twin and Fault-Injection Framework** — implemented visual MVP and proposed CARLA/ROS production pathway.
8. **Evaluation Protocol** — subject-wise, time-aware splits; calibration; ablations; missing-data and context-shift tests.
9. **Prototype Findings** — software integration observations only. Do not present historical synthetic metrics as generalisable results.
10. **Discussion and Limitations** — synthetic labels, no vision/context data, feature mismatch, absent user study/clinical validation.
11. **Ethics, Privacy, and Governance** — consent, minimisation, encrypted telemetry, access control, retention, fairness and human control.
12. **Conclusion** — reproducible next steps.

## Contributions that can be claimed now

1. A modular prototype connecting simulated steering-wheel physiology, risk inference, a dashboard, and a browser-based digital twin.
2. A versioned initial telemetry contract and an implementation roadmap to ROS/CARLA replay and fault-injection testing.
3. An evidence-grounded research protocol that frames context-aware, multimodal forecasting as future work rather than an already demonstrated capability.

## Contributions that require implementation and evidence

- CNN eye/face analysis and PERCLOS.
- Context/habit modelling and personalised recovery dynamics.
- Temporal multi-horizon risk prediction.
- Physics-guided loss/constraints.
- Well-calibrated uncertainty and explanation evaluation.
- Driver-wise real/simulator validation and fairness analysis.
