import asyncio

try:
    import rclpy
    from rclpy.node import Node
    from std_msgs.msg import Float32, Int32, String
    ROS2_AVAILABLE = True
except ImportError:
    ROS2_AVAILABLE = False
    Node = object

from AI_Module.AIML.Week4.predict_risk import predict_risk
from backend.app.websocket.manager import manager
from backend.app.database import SessionLocal
from backend.app.models.telemetry_db import TelemetryLog


class ROS2BridgeNode(Node):
    def __init__(self, loop):
        self.loop = loop
        self.emergency_publisher = None

        if ROS2_AVAILABLE:
            super().__init__('ros2_fastapi_bridge')
            self.create_subscription(Int32, '/heart_rate', self.hr_callback, 10)
            self.create_subscription(Float32, '/skin_temperature', self.temp_callback, 10)
            self.create_subscription(Float32, '/gsr', self.gsr_callback, 10)
            self.create_subscription(Float32, '/grip_pressure', self.grip_callback, 10)
            self.emergency_publisher = self.create_publisher(String, '/vehicle/emergency_stop', 10)

        self.current_frame = {
            "heart_rate": 75.0,
            "gsr": 2.0,
            "grip_pressure": 4.0,
            "skin_temperature": 36.6,
            "rr_interval": 780.0,
            "qrs_duration": 94.0,
            "st_deviation": 0.03,
            "qt_interval": 395.0,
            "ecg_status": 0.0,
            "prediction": {}
        }

    def _trigger_emergency_stop(self, status: str):
        if ROS2_AVAILABLE and self.emergency_publisher:
            msg = String()
            msg.data = f"EMERGENCY_STOP_ACTIVE: Driver Risk Level is {status}"
            self.emergency_publisher.publish(msg)
            self.get_logger().error(f"🚨 CRITICAL ALERT PUBLISHED: {msg.data}")
        else:
            print(f"🚨 [MOCK EMERGENCY TRIGGER]: Status is {status}")

    def _process_and_broadcast(self):
        # Build 9-element feature vector
        features = [
            self.current_frame.get("heart_rate", 75.0),
            self.current_frame.get("gsr", 2.0),
            self.current_frame.get("grip_pressure", 4.0),
            self.current_frame.get("skin_temperature", 36.6),
            self.current_frame.get("rr_interval", 780.0),
            self.current_frame.get("qrs_duration", 94.0),
            self.current_frame.get("st_deviation", 0.03),
            self.current_frame.get("qt_interval", 395.0),
            self.current_frame.get("ecg_status", 0.0)
        ]

        prediction = predict_risk(features)
        self.current_frame["prediction"] = prediction

        status = prediction.get("stabilized_prediction", "Normal").upper()

        if status == "CRITICAL":
            self._trigger_emergency_stop(status)

        asyncio.run_coroutine_threadsafe(
            manager.send_json(self.current_frame),
            self.loop
        )

        db = SessionLocal()
        try:
            log_entry = TelemetryLog(
                heart_rate=self.current_frame["heart_rate"],
                gsr=self.current_frame["gsr"],
                grip_pressure=self.current_frame["grip_pressure"],
                skin_temperature=self.current_frame["skin_temperature"],
                raw_prediction=prediction.get("raw_prediction", "Normal"),
                stabilized_prediction=prediction.get("stabilized_prediction", "Normal"),
                alert_level=status
            )
            db.add(log_entry)
            db.commit()
        except Exception as err:
            db.rollback()
            print(f"DB Write Error: {err}")
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