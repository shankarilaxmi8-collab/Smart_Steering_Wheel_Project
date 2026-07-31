from fastapi import FastAPI
from backend.app.services.simulator import get_sensor_data
from backend.app.models.schemas import DriverStatus
from fastapi import WebSocket
from backend.app.websocket.manager import manager
import asyncio
from fastapi.middleware.cors import CORSMiddleware
from AIML.Week4.predict_risk import predict_risk


app = FastAPI(
    title="Smart Steering Wheel API",
    version="0.1.0"
)

@app.get("/")
def root():
    return {"message": "Backend is running"}

@app.get("/api/v1/health")
def health():
    return {
        "status": "healthy",
        "version": "1.0"
    }

@app.get("/api/v1/status", response_model=DriverStatus)
def status():
    print("AI STATUS ROUTE RUNNING")

    sensor = get_sensor_data()

    features = [
        sensor["heart_rate"],
        sensor["gsr"],
        sensor["grip_pressure"],
        sensor["skin_temperature"]
    ]

    prediction = predict_risk(features)

    print("PREDICTION:", prediction)

    sensor["prediction"] = prediction

    return sensor

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):

    await manager.connect(websocket)

    try:
        while True:
            data = get_sensor_data()
            await manager.send_json(data)
            await asyncio.sleep(1)

    except Exception:
        manager.disconnect(websocket)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
