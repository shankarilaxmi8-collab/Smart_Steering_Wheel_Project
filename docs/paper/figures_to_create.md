# Figures and Tables to Create

| Item | Purpose | Source / status |
| --- | --- | --- |
| Fig. 1 — Project boundary | Distinguish implemented prototype, proposed research modules, and safety boundary. | `digital-twin/architecture/BLUEPRINT.md`, `docs/DIGITAL_TWIN_REPORT.md`; create from verified architecture. |
| Fig. 2 — Canonical telemetry lifecycle | Sensor/replay → validation → fusion → risk → dashboard/twin; show timestamps and quality gates. | `digital-twin/contracts/driver_telemetry_v1.json`, backend simulator, planned ROS path. |
| Fig. 3 — Proposed multimodal temporal architecture | Vision, physiology, context/habit, behaviour, fusion, recovery residual, uncertainty/explanation. | Proposed only; watermark “research design, not implemented.” |
| Fig. 4 — Digital-twin scenario sequence | Normal → caution → high-risk synthetic scenario with alert policy and no vehicle actuation. | `digital-twin/demo_api/`, `AI_Module/simulator/sensor_generator.py`; label as synthetic. |
| Fig. 5 — Personalised recovery concept | Expected post-activity trajectory, observed signal, residual and uncertainty band. | Illustrative/synthetic; no medical interpretation. |
| Table 1 — Evidence matrix | Implemented vs proposed components. | `PROJECT_EVIDENCE.md`. |
| Table 2 — Dataset and label card | Participants, trips, devices, labels, missingness, demographics, consent, split. | Create only after real collection; currently mark unavailable. |
| Table 3 — Model and feature-schema registry | Model ID, features, training data hash, split, calibration, limitation. | Needed to resolve legacy model inconsistency. |
| Table 4 — Ablation and horizon results | F1/AUROC/AUPRC/ECE/false-alerts/lead time for each model. | Future reproducible experiment only. |
| Table 5 — Fault and missing-modality results | Performance/abstention under camera, contact, and sensor-quality failures. | Future digital-twin/HIL experiment. |

Do not use dashboard screenshots as experimental evidence. They are useful demonstrator figures only when captioned with build version and “simulated telemetry.”
