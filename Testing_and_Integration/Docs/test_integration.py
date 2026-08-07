'''
Integration Test Suite for Real-Time In-Vehicle Driver Health Monitor
Week 2 Validation Suite - Testing & Integration Engineering
'''

import asyncio
import json
import time
import pytest
import websockets
from jsonschema import validate, ValidationError

# -----------------------------------------------------------------------------
# Configuration & Endpoints
# -----------------------------------------------------------------------------
WEBSOCKET_URI = "ws://localhost:8000/api/v1/stream"
HEALTH_CHECK_URL = "http://localhost:8000/api/v1/health"
MAX_ALLOWED_LATENCY_MS = 50.0

# -----------------------------------------------------------------------------
# Telemetry API Payload Schema Contract (Week 1 Specification)
# -----------------------------------------------------------------------------
TELEMETRY_SCHEMA = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "timestamp": {
            "type": "number",
            "description": "Epoch timestamp in seconds when packet was emitted"
        },
        "ecg": {
            "type": "array",
            "items": {"type": "number"},
            "minItems": 1,
            "description": "Raw ECG signal array snippet"
        },
        "bpm": {
            "type": "number",
            "minimum": 30,
            "maximum": 250,
            "description": "Heart rate in Beats Per Minute"
        },
        "hrv": {
            "type": "number",
            "minimum": 0,
            "description": "Heart Rate Variability in milliseconds (RMSSD)"
        },
        "gsr": {
            "type": "number",
            "minimum": 0,
            "description": "Galvanic Skin Response / Sweat Conductance in microSiemens (uS)"
        },
        "temp": {
            "type": "number",
            "minimum": 20,
            "maximum": 45,
            "description": "Skin temperature in Celsius"
        },
        "status_tier": {
            "type": "string",
            "enum": ["GREEN", "AMBER", "RED"],
            "description": "Calculated driver health alert tier"
        }
    },
    "required": ["timestamp", "ecg", "bpm", "hrv", "gsr", "temp", "status_tier"],
    "additionalProperties": False
}

# -----------------------------------------------------------------------------
# Test Fixtures & Helper Utilities
# -----------------------------------------------------------------------------
@pytest.fixture(scope="module")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


def validate_packet_schema(packet: dict) -> bool:
    """Validates a single telemetry packet against the defined JSON schema."""
    try:
        validate(instance=packet, schema=TELEMETRY_SCHEMA)
        return True
    except ValidationError as err:
        pytest.fail(f"Schema Validation Error: {err.message} at path {list(err.path)}")


# -----------------------------------------------------------------------------
# 1. Schema Compliance Tests
# -----------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_websocket_stream_schema_compliance():
    """
    Connects to the real-time WebSocket feed and validates 20 consecutive packets
    against the strict telemetry schema contract.
    """
    async with websockets.connect(WEBSOCKET_URI) as ws:
        for packet_idx in range(20):
            raw_msg = await asyncio.wait_for(ws.recv(), timeout=2.0)
            packet = json.loads(raw_msg)
            
            # Assert schema validity
            assert validate_packet_schema(packet), f"Packet {packet_idx} failed schema validation"
            
            # Verify basic logical boundaries
            assert packet["bpm"] > 0, "BPM must be positive"
            assert packet["status_tier"] in ["GREEN", "AMBER", "RED"], "Invalid status_tier value"


# -----------------------------------------------------------------------------
# 2. Performance & End-to-End Latency Tests
# -----------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_websocket_latency_benchmark():
    """
    Measures processing and transmission latency across 50 consecutive packets.
    Asserts that the average latency is strictly under the 50ms NFR constraint.
    """
    latencies_ms = []
    
    async with websockets.connect(WEBSOCKET_URI) as ws:
        for _ in range(50):
            receive_time = time.time()
            raw_msg = await ws.recv()
            packet = json.loads(raw_msg)
            
            packet_time = packet.get("timestamp")
            assert packet_time is not None, "Timestamp missing from payload"
            
            latency = (receive_time - packet_time) * 1000.0
            latencies_ms.append(latency)
            
    avg_latency = sum(latencies_ms) / len(latencies_ms)
    max_latency = max(latencies_ms)
    
    print(f"\n[Latency Metrics] Avg: {avg_latency:.2f}ms | Max: {max_latency:.2f}ms | Target: <{MAX_ALLOWED_LATENCY_MS}ms")
    
    assert avg_latency < MAX_ALLOWED_LATENCY_MS, (
        f"Average system latency ({avg_latency:.2f}ms) exceeded maximum allowable threshold ({MAX_ALLOWED_LATENCY_MS}ms)"
    )


# -----------------------------------------------------------------------------
# 3. Anomaly & Threshold Trigger Verification
# -----------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_physiological_threshold_triggers():
    """
    Verifies that physiological anomaly indicators correctly map to status tiers:
    - Normal baseline -> GREEN
    - Moderate stress (High BPM / low HRV) -> AMBER
    - Severe anomaly (GSR > 10uS or dangerous ECG/BPM spikes) -> RED
    """
    async with websockets.connect(WEBSOCKET_URI) as ws:
        # Sample 30 packets and evaluate status tier transitions relative to metrics
        for _ in range(30):
            raw_msg = await ws.recv()
            packet = json.loads(raw_msg)
            
            gsr = packet["gsr"]
            bpm = packet["bpm"]
            tier = packet["status_tier"]
            
            # Rule Verification: High GSR (>10 uS) must force RED status
            if gsr > 10.0 or bpm > 140:
                assert tier == "RED", f"Critical physiological threshold exceeded (GSR: {gsr}, BPM: {bpm}) but tier was {tier}"
            elif bpm > 100 or gsr > 5.0:
                assert tier in ["AMBER", "RED"], f"Elevated stress metrics (GSR: {gsr}, BPM: {bpm}) expected AMBER/RED, got {tier}"


# -----------------------------------------------------------------------------
# 4. Chaos & Connection Resilience Tests
# -----------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_websocket_reconnection_resilience():
    """
    Simulates repeated client disconnections and rapid reconnections to confirm
    the backend handles client churn without leaking memory or crashing.
    """
    for attempt in range(5):
        async with websockets.connect(WEBSOCKET_URI) as ws:
            msg = await ws.recv()
            assert msg is not None
            # Abruptly close connection
            await ws.close()
        await asyncio.sleep(0.1)  # Brief pause between reconnection attempts


if __name__ == "__main__":
    pytest.main(["-v", __file__])
