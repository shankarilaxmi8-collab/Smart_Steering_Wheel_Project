# `smart_wheel_msgs` skeleton

Create this as an `ament_cmake` ROS 2 interface package in the CARLA/ROS VM. The first message should be `DriverTelemetry.msg` with the fields defined in `../../contracts/driver_telemetry_v1.json` plus ROS `std_msgs/Header`.

Keep the browser/API JSON contract separate from ROS type generation; adapters own the translation.
