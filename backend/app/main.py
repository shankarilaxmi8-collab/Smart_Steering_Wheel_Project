import asyncio
import threading
from contextlib import asynccontextmanager
from datetime import datetime, timezone

from fastapi import Depends, FastAPI, HTTPException, Query, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from backend.app.database import Base, SessionLocal, engine, get_db, migrate_schema
from backend.app.models.schemas import DriverStatus, PredictionResult, TelemetryInput
from backend.app.models.telemetry_db import TelemetryLog
from backend.app.services.ai_adapter import predict_telemetry, unavailable_prediction
from backend.app.services.ros_bridge import ROS2BridgeNode
from backend.app.services.simulator import generate_ecg_chunk, get_sensor_data
from backend.app.websocket.manager import manager

try:
    import rclpy

    ROS2_AVAILABLE = True
except ImportError:
    ROS2_AVAILABLE = False


def _run_ros(node: ROS2BridgeNode) -> None:
    rclpy.spin(node)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    migrate_schema()
    ros_node = None
    if ROS2_AVAILABLE:
        rclpy.init()
        ros_node = ROS2BridgeNode(loop=asyncio.get_running_loop())
        threading.Thread(target=_run_ros, args=(ros_node,), daemon=True).start()
    yield
    if ROS2_AVAILABLE:
        if ros_node is not None:
            ros_node.destroy_node()
        rclpy.shutdown()


app = FastAPI(title="Smart Steering Wheel API", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


def _timestamp(value: datetime | None = None) -> str:
    return (value or datetime.now(timezone.utc)).isoformat()


def _serialize_log(log: TelemetryLog) -> dict:
    raw_prediction = "CRITICAL" if log.raw_prediction == "CARDIAC_EVENT" else log.raw_prediction
    stabilized_prediction = (
        "CRITICAL" if log.stabilized_prediction == "CARDIAC_EVENT" else log.stabilized_prediction
    )
    prediction = PredictionResult(
        raw_prediction=raw_prediction,
        stabilized_prediction=stabilized_prediction,
        status=stabilized_prediction,
        confidence=log.confidence,
        risk_score=round(log.confidence * 100, 2),
    )
    return {
        "schema_version": "1.0",
        "id": log.id,
        "timestamp": _timestamp(log.timestamp),
        "heart_rate": log.heart_rate,
        "hrv": log.hrv,
        "gsr": log.gsr,
        "grip_pressure": log.grip_pressure,
        "skin_temperature": log.skin_temperature,
        "ecg_signal": log.ecg_signal,
        "rr_interval": log.rr_interval,
        "qrs_duration": log.qrs_duration,
        "st_deviation": log.st_deviation,
        "qt_interval": log.qt_interval,
        "condition": stabilized_prediction,
        "status": stabilized_prediction,
        "scenario_status": "UNKNOWN",
        "prediction": prediction.model_dump(),
        "sensor_status": "Recorded",
        "alert_level": log.alert_level,
    }


def _persist(db: Session, telemetry: TelemetryInput, prediction: PredictionResult) -> TelemetryLog:
    log = TelemetryLog(
        timestamp=telemetry.timestamp or datetime.now(timezone.utc),
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
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


def _live_payload(
    timestamp: str | int,
    telemetry: TelemetryInput,
    scenario_status: str,
    prediction: PredictionResult,
    ecg: list[float],
) -> dict:
    """Build the versioned live contract.

    `status` is the deterministic CSV scenario in demo mode.  The ML result is
    intentionally preserved inside `prediction` for evaluation, rather than
    being allowed to overwrite incomplete dummy telemetry.
    """
    return {
        "schema_version": "1.0",
        "timestamp": timestamp,
        "heart_rate": telemetry.heart_rate,
        "hrv": telemetry.hrv,
        "gsr": telemetry.gsr,
        "grip_pressure": telemetry.grip_pressure,
        "skin_temperature": telemetry.skin_temperature,
        "ecg_signal": telemetry.ecg_signal,
        "rr_interval": telemetry.rr_interval or 60_000.0 / telemetry.heart_rate,
        "qrs_duration": telemetry.qrs_duration,
        "st_deviation": telemetry.st_deviation,
        "qt_interval": telemetry.qt_interval,
        "condition": scenario_status,
        "status": scenario_status,
        "scenario_status": scenario_status,
        "prediction": prediction.model_dump(),
        "sensor_status": "Connected",
        "ecg": ecg,
        "ecg_sampling_rate": 250,
        "ecg_status": "SIMULATED",
    }


@app.get("/")
def root():
    return {"message": "Backend is running"}


@app.get("/api/v1/health")
def health():
    try:
        # Fail readiness early when the configured model or dependency cannot load.
        from backend.app.services.ai_adapter import get_predictor

        get_predictor()
        model_status = "ready"
    except Exception as error:
        model_status = f"unavailable: {type(error).__name__}"
    return {"status": "healthy", "version": app.version, "model": model_status}


@app.get("/api/v1/ready")
def readiness():
    """Readiness differs from liveness: serving demo status does not make ML ready."""
    try:
        from backend.app.services.ai_adapter import get_predictor

        get_predictor()
    except Exception as error:
        raise HTTPException(status_code=503, detail=f"Risk model unavailable: {type(error).__name__}") from error
    return {"status": "ready", "version": app.version}


@app.get("/api/v1/status", response_model=DriverStatus)
def status():
    timestamp, telemetry, scenario_status = get_sensor_data()
    try:
        prediction = predict_telemetry(telemetry)
    except Exception:
        prediction = unavailable_prediction()
    return _live_payload(timestamp, telemetry, scenario_status, prediction, ecg=[])


@app.post("/api/v1/sensors", status_code=201)
def receive_sensor_data(data: TelemetryInput, db: Session = Depends(get_db)):
    try:
        prediction = predict_telemetry(data)
        log = _persist(db, data, prediction)
    except HTTPException:
        raise
    except Exception as error:
        db.rollback()
        raise HTTPException(status_code=503, detail="Unable to process telemetry") from error
    return {"message": "Telemetry stored", "record": _serialize_log(log)}


@app.get("/api/v1/sensors")
def get_latest_sensors(db: Session = Depends(get_db)):
    log = db.query(TelemetryLog).order_by(TelemetryLog.timestamp.desc()).first()
    if log is None:
        raise HTTPException(status_code=404, detail="No telemetry has been recorded")
    return _serialize_log(log)


@app.get("/api/v1/history")
def get_history(limit: int = Query(default=50, ge=1, le=1000), db: Session = Depends(get_db)):
    logs = db.query(TelemetryLog).order_by(TelemetryLog.timestamp.desc()).limit(limit).all()
    return [_serialize_log(log) for log in reversed(logs)]


@app.get("/api/v1/alerts")
def get_alerts(limit: int = Query(default=100, ge=1, le=1000), db: Session = Depends(get_db)):
    alerts = (
        db.query(TelemetryLog)
        .filter(TelemetryLog.alert_level.in_(["WARNING", "CRITICAL"]))
        .order_by(TelemetryLog.timestamp.desc())
        .limit(limit)
        .all()
    )
    return [_serialize_log(log) for log in reversed(alerts)]


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    ecg_phase = 0.0
    try:
        while True:
            timestamp, telemetry, scenario_status = get_sensor_data()
            try:
                prediction = predict_telemetry(telemetry)
            except Exception:
                # Keep dummy telemetry usable when the optional model cannot
                # load; the contract makes this visible via prediction.available.
                prediction = unavailable_prediction()

            ecg = generate_ecg_chunk(telemetry.heart_rate, phase_offset=ecg_phase)
            ecg_phase = (ecg_phase + len(ecg) * telemetry.heart_rate / (60.0 * 250.0)) % 1.0
            payload = _live_payload(timestamp, telemetry, scenario_status, prediction, ecg)
            db = SessionLocal()
            try:
                _persist(db, telemetry, prediction)
            except Exception:
                db.rollback()
            finally:
                db.close()
            await websocket.send_json(payload)
            await asyncio.sleep(0.2)
    except WebSocketDisconnect:
        pass
    finally:
        manager.disconnect(websocket)
