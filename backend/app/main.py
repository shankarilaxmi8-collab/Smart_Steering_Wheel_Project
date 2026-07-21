from fastapi import FastAPI
from app.services.simulator import get_sensor_data
from app.models.schemas import DriverStatus
from fastapi import WebSocket
from app.websocket.manager import manager
import asyncio

app = FastAPI(
    title="Smart Steering Wheel API",
    version="0.1.0"
)

@app.get("/")
def root():
    return {"message": "Backend is running"}

@app.get("/api/v1/status", response_model=DriverStatus)
def health():
    return {
        "status": "healthy",
        "version": "1.0"
    }

@app.get("/api/v1/status", response_model=DriverStatus)
def status():
    return get_sensor_data()

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
        