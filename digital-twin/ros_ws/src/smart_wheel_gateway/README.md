# `smart_wheel_gateway` skeleton

Responsibilities: decode USB serial or BLE packets, validate checksum/ranges/sequence, add receive timestamp, publish `/smart_wheel/telemetry`, and emit sensor-quality faults. It must not contain driver-risk policy or direct vehicle-control logic.
