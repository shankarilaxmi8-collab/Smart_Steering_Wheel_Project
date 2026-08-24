# Research Gaps and Submission Gate

## Must close before performance claims

| Gap | Required action | Evidence of closure |
| --- | --- | --- |
| Single source of truth | Select one model/artifact and one versioned feature schema; eliminate KNN/Random Forest/XGBoost ambiguity. | Model card, dataset hash, commit hash, schema test, reproducible training command. |
| Synthetic-label leakage | Separate generator rules from features; test only on held-out scenarios/drivers/time blocks. | Leakage audit and held-out evaluation notebook. |
| Ground truth | Define fatigue/impairment labels with validated subjective scales, eye measures and simulator driving-performance events. | Protocol, annotation guide, inter-rater agreement where applicable. |
| Human data governance | Obtain ethics/consent approval appropriate to the institution; minimise and protect biometric/video data. | Approval/waiver, consent text, data-management plan. |
| Personalisation | Establish population train/validation/test drivers, then adapt using a constrained calibration period. | Leave-one-driver-out and adaptation curves. |
| Time forecasting | Build fixed observation windows and 5/10/15-minute targets without future leakage. | Horizon-specific AUROC/AUPRC, lead time, calibration, false alerts/hour. |
| Signal quality | Add contact-loss/quality fields and an explicit `UNKNOWN` / defer action. | Sensor-fault test results and coverage-versus-risk curves. |
| Multimodal fusion | Implement vision, physiology, context, and driving inputs with timestamps and missing-modality masking. | Ablation table and synchronization tests. |
| Physics guidance | Learn personal expected recovery and constrain residuals/rate changes; do not hard-code universal health norms. | Comparison against unconstrained fusion, subgroup calibration plots. |
| Safety UX | Define graded alert policy, acknowledgement, quiet periods, and no-control safety boundary. | Hazard analysis, human-factors test, alert log review. |

## Recommended experimental design

- Split by driver and by trip; never randomly split adjacent video frames or rolling windows.
- Keep all records from a driver/trip in a single partition except an explicitly declared personalisation calibration segment.
- Benchmark vision-only, physiology/context-only, unconstrained fusion, full proposed model, and full model with modalities removed.
- Test bright/dark lighting, varied road and cabin conditions, post-exercise recovery, sensor contact loss, missing camera, and noisy EDA/PPG.
- Report sensitivity, specificity, macro F1, AUROC/AUPRC where class imbalance warrants it, Brier score/ECE, false alerts per driving hour, mean warning lead time, latency, and abstention coverage.
- Stratify by driver, driving style, age bands where ethically collected, and skin-tone-relevant optical sensing quality; do not make causal fairness claims without adequate sample sizes.

## Immediate engineering backlog

1. Repair the legacy hard-coded preprocessing paths and add a reproducible package/test command.
2. Harmonise `driver-twin.v1`, Pydantic schemas, replay data, and model feature order.
3. Replace clinical event names in APIs/UI with `NORMAL`, `CAUTION`, `HIGH_RISK`, and `UNKNOWN` or equivalent non-diagnostic language.
4. Persist timestamp, sequence, source, quality, model version, calibration version, and explanation codes for every prediction.
5. Add contract, replay, feature-order, stale-data, and model-fallback tests before expanding model complexity.
