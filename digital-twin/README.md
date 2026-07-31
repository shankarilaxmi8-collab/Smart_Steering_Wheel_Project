# Smart Steering Wheel Digital Twin — Internal MVP

This directory is intentionally isolated from the existing `backend/`, `Frontend/`, and `AIML/` work. It is the first executable architecture of the proposed twin.

## What runs now

- A 3D browser scene with an ego vehicle travelling along a curved road.
- A live WebSocket telemetry stream at 20 Hz.
- A controllable steering-wheel input, vehicle dynamics, driver physiology, model-style risk state, and alert indicator.
- Normal, warning, and critical scenarios for a repeatable demo.
- A blueprint for the production ROS 2 / CARLA implementation and ROS package skeletons.

The scene is a **visual MVP**, not a vehicle-physics or medical model. It uses Three.js from a public CDN. CARLA and ROS 2 are deliberately not required to prove the first end-to-end interaction.

## Run

From the project root, using any Python environment with FastAPI and Uvicorn installed:

```powershell
python -m pip install -r digital-twin/requirements.txt
python -m uvicorn demo_api.main:app --app-dir digital-twin --reload --port 8100
```

Open [http://localhost:8100](http://localhost:8100). Use the steering slider or A/D keys, then choose a driver scenario. The browser connects to `ws://localhost:8100/ws` automatically.

For the self-contained demo, use a normal Python virtual environment rather than the repository's currently tracked `venv/` directory.

## Directory map

```text
digital-twin/
  demo_api/                 # runnable FastAPI + WebSocket simulation core
  web/                      # runnable Three.js operator/demo screen
  contracts/                # versioned canonical telemetry contract
  architecture/             # production blueprint and decision record
  ros_ws/src/               # ROS 2 package skeletons; not required for MVP
  tests/                    # demo API verification
  requirements.txt
```

## Next transition

Replace the simulator source in `demo_api/simulation.py` with a ROS gateway adapter. Keep the JSON contract unchanged; then the same UI can consume recorded CSV, physical wheel packets, or ROS/CARLA data.

See [architecture/BLUEPRINT.md](architecture/BLUEPRINT.md) for the production build sequence.
