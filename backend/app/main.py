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
    # Construct 9-feature vector matching the trained model requirement
    features = [
        sensor.get("heart_rate", 75.0),
        sensor.get("gsr", 2.0),
        sensor.get("grip_pressure", 4.0),
        sensor.get("skin_temperature", 36.6),
        sensor.get("rr_interval", 780.0),
        sensor.get("qrs_duration", 94.0),
        sensor.get("st_deviation", 0.03),
        sensor.get("qt_interval", 395.0),
        sensor.get("ecg_status", 0.0)
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


@app.post("/api/v1/sensors")
def receive_sensor_data(data: dict, db: Session = Depends(get_db)):
    # Step 1: Run the AI prediction
    from AI_Module.AIML.Week4.predict_risk import predict_risk
    ai_result = predict_risk(data)
    
    # Step 2: Save it to the database!
    new_log = TelemetryLog(
        heart_rate=data.get("heart_rate", 75.0),
        gsr=data.get("gsr", 3.0),
        grip_pressure=data.get("grip_pressure", 15.0),
        skin_temperature=data.get("skin_temperature", 33.0),
        ecg_signal=data.get("ecg_signal", 0.0),
        rr_interval=data.get("rr_interval", 800.0),
        qrs_duration=data.get("qrs_duration", 90.0),
        st_deviation=data.get("st_deviation", 0.0),
        qt_interval=data.get("qt_interval", 390.0),
        
        raw_prediction=ai_result["raw_prediction"],
        stabilized_prediction=ai_result["stabilized_prediction"],
        confidence=ai_result["confidence"],
        alert_level=ai_result["stabilized_prediction"]
    )
    
    db.add(new_log)
    db.commit()
    
    return {
        "message": "Data successfully saved to database!",
        "prediction": ai_result
    }


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
            
            # --- NEW FIELDS FOR THE AI / FRONTEND ---
            "ecg_signal": getattr(log, "ecg_signal", 0.0),
            "rr_interval": getattr(log, "rr_interval", 0.0),
            "qrs_duration": getattr(log, "qrs_duration", 0.0),
            "st_deviation": getattr(log, "st_deviation", 0.0),
            "qt_interval": getattr(log, "qt_interval", 0.0),
            "confidence": getattr(log, "confidence", 0.0),
            # ----------------------------------------
            
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