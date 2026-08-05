import asyncio
import threading
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

try:
    import rclpy
    ROS2_AVAILABLE = True
except ImportError:
    ROS2_AVAILABLE = False

from backend.app.services.simulator import get_sensor_data
from backend.app.models.schemas import DriverStatus
from backend.app.websocket.manager import manager
from AI_Module.AIML.Week4.predict_risk import predict_risk
from backend.app.services.ros_bridge import ROS2BridgeNode
from backend.app.database import Base, engine, get_db
from backend.app.models.telemetry_db import TelemetryLog


def spin_ros(node):
    if ROS2_AVAILABLE:
        rclpy.spin(node)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database tables exist
    Base.metadata.create_all(bind=engine)

    if ROS2_AVAILABLE:
        rclpy.init()
        loop = asyncio.get_running_loop()
        ros_node = ROS2BridgeNode(loop=loop)
        ros_thread = threading.Thread(target=spin_ros, args=(ros_node,), daemon=True)
        ros_thread.start()
        print("🚀 ROS 2 Bridge started successfully.")
    else:
        print("⚠️ rclpy not found! Running backend in standalone mode.")

    yield

    if ROS2_AVAILABLE:
        rclpy.shutdown()


app = FastAPI(
    title="Smart Steering Wheel API",
    version="0.1.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Backend is running"}


@app.get("/api/v1/health")
def health():
    return {"status": "healthy", "version": "1.0"}


@app.get("/api/v1/status", response_model=DriverStatus)
def status():
    sensor = get_sensor_data()
    features = [
        sensor["heart_rate"],
        sensor["gsr"],
        sensor["grip_pressure"],
        sensor["skin_temperature"]
    ]
    prediction = predict_risk(features)
    sensor["prediction"] = prediction
    return sensor


@app.get("/api/v1/history")
def get_history(limit: int = 50, db: Session = Depends(get_db)):
    try:
        logs = db.query(TelemetryLog).order_by(TelemetryLog.timestamp.desc()).limit(limit).all()
        return [
            {
                "id": log.id,
                "timestamp": str(log.timestamp) if log.timestamp else None,
                "heart_rate": log.heart_rate,
                "gsr": log.gsr,
                "grip_pressure": log.grip_pressure,
                "skin_temperature": log.skin_temperature,
                "raw_prediction": log.raw_prediction,
                "stabilized_prediction": log.stabilized_prediction,
                "alert_level": getattr(log, "alert_level", "NORMAL")
            }
            for log in logs
        ][::-1]
    except Exception as e:
        return {"error": f"Database Query Error: {str(e)}"}


@app.get("/api/v1/sensors")
def get_latest_sensors(db: Session = Depends(get_db)):
    try:
        log = db.query(TelemetryLog).order_by(TelemetryLog.timestamp.desc()).first()
        if not log:
            return {"message": "No sensor data logged yet."}

        return {
            "id": log.id,
            "timestamp": str(log.timestamp) if log.timestamp else None,
            "heart_rate": log.heart_rate,
            "gsr": log.gsr,
            "grip_pressure": log.grip_pressure,
            "skin_temperature": log.skin_temperature,
            "raw_prediction": log.raw_prediction,
            "stabilized_prediction": log.stabilized_prediction,
            "alert_level": getattr(log, "alert_level", "NORMAL")
        }
    except Exception as e:
        return {"error": f"Database Query Error: {str(e)}"}


@app.get("/api/v1/alerts")
def get_critical_alerts(db: Session = Depends(get_db)):
    try:
        alerts = db.query(TelemetryLog).filter(TelemetryLog.alert_level == "CRITICAL").order_by(TelemetryLog.timestamp.desc()).all()
        return [
            {
                "id": log.id,
                "timestamp": str(log.timestamp) if log.timestamp else None,
                "heart_rate": log.heart_rate,
                "gsr": log.gsr,
                "grip_pressure": log.grip_pressure,
                "skin_temperature": log.skin_temperature,
                "raw_prediction": log.raw_prediction,
                "stabilized_prediction": log.stabilized_prediction,
                "alert_level": log.alert_level
            }
            for log in alerts
        ]
    except Exception as e:
        return {"error": f"Database Query Error: {str(e)}"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await asyncio.sleep(1)
    except Exception:
        manager.disconnect(websocket)