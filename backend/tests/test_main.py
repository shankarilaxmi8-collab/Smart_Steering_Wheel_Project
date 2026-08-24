"""Contract tests that run without a network server or TestClient dependency."""

from backend.app.main import root, status
from backend.app.services.simulator import reset_demo


def test_root():
    assert root() == {"message": "Backend is running"}


def test_demo_status_contract_contains_canonical_fields():
    reset_demo(0)
    payload = status()

    assert payload["schema_version"] == "1.0"
    assert payload["status"] == "NORMAL"
    assert payload["scenario_status"] == "NORMAL"
    assert payload["condition"] == "NORMAL"
    assert payload["sensor_status"] == "Connected"
    assert set(payload["prediction"]) >= {
        "status",
        "raw_prediction",
        "stabilized_prediction",
        "confidence",
        "risk_score",
        "available",
    }


def test_dummy_dataset_exposes_all_status_transitions():
    for index, expected in ((0, "NORMAL"), (176, "WARNING"), (216, "CRITICAL")):
        reset_demo(index)
        payload = status()
        assert payload["status"] == expected
        assert payload["scenario_status"] == expected
    
