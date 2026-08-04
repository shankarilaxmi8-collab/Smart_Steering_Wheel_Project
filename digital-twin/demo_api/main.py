from __future__ import annotations

import asyncio
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from .simulation import TwinSimulation

ROOT = Path(__file__).resolve().parents[1]
WEB_DIR = ROOT / "web"
simulation = TwinSimulation()


@asynccontextmanager
async def lifespan(_: FastAPI):
    yield


app = FastAPI(title="Smart Wheel Digital Twin MVP", version="0.1.0", lifespan=lifespan)
app.mount("/assets", StaticFiles(directory=WEB_DIR), name="assets")


@app.get("/")
async def index():
    return FileResponse(WEB_DIR / "index.html")


@app.get("/api/v1/state")
async def state():
    return simulation.step(0.0)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    async def receive_commands():
        try:
            while True:
                command = await websocket.receive_json()
                if command.get("type") == "wheel":
                    simulation.set_wheel(float(command["normalized"]))
                elif command.get("type") == "scenario":
                    simulation.set_scenario(str(command["name"]))
        except WebSocketDisconnect:
            return

    receiver = asyncio.create_task(receive_commands())
    try:
        while not receiver.done():
            await websocket.send_json(simulation.step())
            await asyncio.sleep(0.05)
    finally:
        receiver.cancel()
