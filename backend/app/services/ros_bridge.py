# backend/app/services/ros_bridge.py
import asyncio

# Safe import for rclpy on Windows environments
try:
    import rclpy
    from rclpy.node import Node
    from std_msgs.msg import Float32, Int32
    ROS2_AVAILABLE = True
except ImportError:
    ROS2_AVAILABLE = False
    Node = object  # Dummy base class when ROS 2 is not available

from AIML.Week4.predict_risk import predict_risk
from backend.app.websocket.manager import manager
from backend.app.database import SessionLocal
from backend.app.models.telemetry_db import TelemetryLog


class ROS2BridgeNode(Node):
    def __init__(self, loop):
        if ROS2_AVAILABLE:
            super().__init__('ros2_fastapi_bridge')
            # ROS 2 Topic Subscriptions
            self.create_subscription(Int32, '/heart_rate', self.hr_callback, 10)
            self.create_subscription(Float32, '/skin_temperature', self.temp_callback, 10)
            self.create_subscription(Float32, '/gsr', self.gsr_callback, 10)
            self.create_subscription(Float32, '/grip_pressure', self.grip_callback, 10)

        self.loop = loop

        # In-memory buffer for current telemetry frame
        self.current_frame = {
            "heart_rate": 75.0,
            "gsr": 2.0,
            "grip_pressure": 4.0,
            "skin_temperature": 36.6,
            "prediction": {}
        }

    def _process_and_broadcast(self):
        # 1. Prepare feature vector for ML model
        features = [
            self.current_frame["heart_rate"],
            self.current_frame["gsr"],
            self.current_frame["grip_pressure"],
            self.current_frame["skin_temperature"]
        ]

        # 2. Run ML prediction engine
        prediction = predict_risk(features)
        self.current_frame["prediction"] = prediction

        # 3. Broadcast to WebSocket clients
        asyncio.run_coroutine_threadsafe(
            manager.send_json(self.current_frame),
            self.loop
        )

        # 4. Save entry to Database
        db = SessionLocal()
        try:
            log_entry = TelemetryLog(
                heart_rate=self.current_frame["heart_rate"],
                gsr=self.current_frame["gsr"],
                grip_pressure=self.current_frame["grip_pressure"],
                skin_temperature=self.current_frame["skin_temperature"],
                raw_prediction=prediction.get("raw_prediction", "Normal"),
                stabilized_prediction=prediction.get("stabilized_prediction", "Normal")
            )
            db.add(log_entry)
            db.commit()
        except Exception as err:
            db.rollback()
            if ROS2_AVAILABLE:
                self.get_logger().error(f"DB Write Error: {err}")
            else:
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