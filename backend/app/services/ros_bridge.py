"""ROS 2 ingress that converts topic values into the same public telemetry contract."""

import asyncio
from datetime import datetime, timezone

try:
    import rclpy
    from rclpy.node import Node
    from std_msgs.msg import Float32, Int32

    ROS2_AVAILABLE = True
except ImportError:
    ROS2_AVAILABLE = False
    Node = object

from backend.app.database import SessionLocal
from backend.app.models.schemas import TelemetryInput
from backend.app.models.telemetry_db import TelemetryLog
from backend.app.services.ai_adapter import predict_telemetry
from backend.app.websocket.manager import manager


class ROS2BridgeNode(Node):
    """Publishes advisory risk telemetry; it never commands vehicle controls."""

    def __init__(self, loop):
        self.loop = loop
        self.current_frame = {
            "heart_rate": 75.0,
            "hrv": 35.0,
            "gsr": 3.0,
            "grip_pressure": 25.0,
            "skin_temperature": 34.0,
            "ecg_signal": 0.0,
            "rr_interval": 800.0,
            "qrs_duration": 90.0,
            "st_deviation": 0.0,
            "qt_interval": 390.0,
        }
        if ROS2_AVAILABLE:
            super().__init__("ros2_fastapi_bridge")
            self.create_subscription(Int32, "/heart_rate", self.hr_callback, 10)
            self.create_subscription(Float32, "/skin_temperature", self.temp_callback, 10)
            self.create_subscription(Float32, "/gsr", self.gsr_callback, 10)
            self.create_subscription(Float32, "/grip_pressure", self.grip_callback, 10)

    def _process_and_broadcast(self) -> None:
        telemetry = TelemetryInput(**self.current_frame)
        prediction = predict_telemetry(telemetry)
        payload = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            **telemetry.model_dump(exclude={"timestamp"}),
            "condition": prediction.status,
            "prediction": prediction.model_dump(),
            "sensor_status": "Connected",
            "ecg": [],
            "ecg_sampling_rate": 250,
            "ecg_status": "AWAITING_ECG_STREAM",
            "emergency_protocol": {"active": prediction.status == "CRITICAL", "mode": "ADVISORY_ONLY"},
        }
        asyncio.run_coroutine_threadsafe(manager.send_json(payload), self.loop)

        db = SessionLocal()
        try:
            db.add(
                TelemetryLog(
                    heart_rate=telemetry.heart_rate,
                    hrv=telemetry.hrv,
                    gsr=telemetry.gsr,
                    grip_pressure=telemetry.grip_pressure,
                    skin_temperature=telemetry.skin_temperature,
                    ecg_signal=telemetry.ecg_signal,
                    rr_interval=telemetry.rr_interval or 60_000.0 / telemetry.heart_rate,
                    qrs_duration=telemetry.qrs_duration,
                    st_deviation=telemetry.st_deviation,
                    qt_interval=telemetry.qt_interval,
                    confidence=prediction.confidence,
                    raw_prediction=prediction.raw_prediction,
                    stabilized_prediction=prediction.stabilized_prediction,
                    alert_level=prediction.status,
                )
            )
            db.commit()
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()

    def hr_callback(self, msg):
        self.current_frame["heart_rate"] = float(msg.data)
        self._process_and_broadcast()

    def temp_callback(self, msg):
        self.current_frame["skin_temperature"] = float(msg.data)
        self._process_and_broadcast()

    def gsr_callback(self, msg):
        self.current_frame["gsr"] = float(msg.data)
        self._process_and_broadcast()

    def grip_callback(self, msg):
        self.current_frame["grip_pressure"] = float(msg.data)
        self._process_and_broadcast()
