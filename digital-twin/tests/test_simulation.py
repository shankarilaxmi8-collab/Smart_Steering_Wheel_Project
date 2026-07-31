from demo_api.simulation import TwinSimulation


def test_critical_scenario_and_wheel_control():
    simulation = TwinSimulation()
    simulation.set_scenario("critical")
    simulation.set_wheel(0.5)
    payload = simulation.step()
    assert payload["risk"] == "CRITICAL"
    assert payload["wheel_angle_deg"] == 225.0
    assert payload["lane_offset_m"] > 0
    assert payload["schema_version"] == "driver-twin.v1"
