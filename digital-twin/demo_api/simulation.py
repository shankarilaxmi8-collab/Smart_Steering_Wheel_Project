"""Deterministic, non-safety-critical data source for the visual MVP."""

from __future__ import annotations

from dataclasses import dataclass, asdict
from math import sin
from time import time_ns


@dataclass
class TwinState:
    sequence: int = 0
    scenario: str = "normal"
    wheel_angle_deg: float = 0.0
    vehicle_speed_kph: float = 42.0
    lane_offset_m: float = 0.0
    heading_deg: float = 0.0
    heart_rate_bpm: float = 74.0
    hrv_ms: float = 48.0
    gsr_us: float = 3.1
    skin_temperature_c: float = 33.5
    risk: str = "NORMAL"
    alert: str = "None"
    sensor_quality: float = 0.99


class TwinSimulation:
    """Small simulation that can later be replaced by a ROS/CARLA adapter."""

    SCENARIOS = {
        "normal": (74.0, 48.0, 3.1, 33.5, "NORMAL", "None"),
        "warning": (95.0, 31.0, 5.8, 32.7, "WARNING", "Driver stress detected"),
        "critical": (126.0, 16.0, 9.5, 30.8, "CRITICAL", "Critical health alert — pull over safely"),
    }

    def __init__(self) -> None:
        self.state = TwinState()
        self._elapsed_s = 0.0

    def set_wheel(self, normalized: float) -> None:
        self.state.wheel_angle_deg = max(-1.0, min(1.0, normalized)) * 450.0

    def set_scenario(self, scenario: str) -> None:
        if scenario not in self.SCENARIOS:
            raise ValueError(f"Unknown scenario: {scenario}")
        self.state.scenario = scenario

    def step(self, dt_s: float = 0.05) -> dict:
        self._elapsed_s += dt_s
        s = self.state
        s.sequence += 1

        base_hr, base_hrv, base_gsr, base_temp, s.risk, s.alert = self.SCENARIOS[s.scenario]
        pulse = sin(self._elapsed_s * 1.7)
        s.heart_rate_bpm = round(base_hr + pulse * (1.2 if s.scenario == "normal" else 2.8), 1)
        s.hrv_ms = round(base_hrv + sin(self._elapsed_s) * 1.4, 1)
        s.gsr_us = round(base_gsr + sin(self._elapsed_s * 0.6) * 0.18, 2)
        s.skin_temperature_c = round(base_temp + sin(self._elapsed_s * 0.35) * 0.08, 2)

        steering = s.wheel_angle_deg / 450.0
        s.heading_deg = round(steering * 18.0, 1)
        s.lane_offset_m = round(max(-1.65, min(1.65, s.lane_offset_m + steering * dt_s * 0.85)), 3)
        s.vehicle_speed_kph = round(42.0 - abs(steering) * 5.0, 1)

        payload = asdict(s)
        payload.update({
            "schema_version": "driver-twin.v1",
            "event_time_ns": time_ns(),
            "simulation_time_s": round(self._elapsed_s, 2),
            "source": "internal-mvp-simulator",
        })
        return payload
