# Production Blueprint

## MVP boundary

`demo_api` is an executable contract demonstrator. It is intentionally separate from CARLA/ROS and does not claim physical or clinical fidelity.

## Target data path

```mermaid
flowchart LR
  W[Wheel MCU] --> G[smart_wheel_gateway]
  G --> T[/smart_wheel/telemetry]
  T --> F[driver_state_fusion]
  F --> R[risk_inference]
  T --> C[carla_smart_wheel_bridge]
  C --> V[CARLA ROS bridge]
  F --> A[API adapter]
  R --> A
  V --> A
  A --> U[React operator UI]
  F --> B[rosbag2 + TimescaleDB]
```

## ROS topic blueprint

| Topic | Producer | Consumer | Rate |
| --- | --- | --- | --- |
| `/smart_wheel/telemetry` | gateway | fusion, recorder | 30 Hz |
| `/smart_wheel/driver_risk` | risk inference | API adapter, alert policy | 5–30 Hz |
| `/carla/ego_vehicle/vehicle_control_cmd` | CARLA adapter | CARLA bridge | 30–60 Hz |
| `/carla/ego_vehicle/vehicle_status` | CARLA bridge | fusion, API adapter | 20 Hz |
| `/smart_wheel/alert_event` | alert policy | UI, recorder | event-driven |

## Delivery order

1. Resolve existing repository quality blockers independently; do not couple that work to this MVP.
2. Introduce `smart_wheel_msgs` and run CSV replay through `/smart_wheel/telemetry`.
3. Swap `TwinSimulation` for a ROS WebSocket adapter while retaining `driver-twin.v1`.
4. Bring up CARLA with synchronous scenarios and bind wheel angle to ego steering.
5. Add physical hardware gateway, calibration, quality checks, rosbag replay, and DB persistence.

## Safety boundary

The wheel command path in this project is simulator-only. A road-vehicle command path requires separately engineered safety controls, independent validation, human override, and the appropriate regulatory work.
