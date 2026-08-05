import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

# Create a test client using FastAPI's built-in TestClient
client = TestClient(app)

def test_root():
    """Verify root endpoint responds with 200 OK."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Backend is running"}

def test_health_check():
    """Verify health check endpoint returns status healthy."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data

def test_get_status():
    """Verify driver status endpoint returns expected telemetry structure."""
    response = client.get("/api/v1/status")
    assert response.status_code == 200
    data = response.json()
    assert "heart_rate" in data
    assert "skin_temperature" in data
    assert "prediction" in data

def test_get_history():
    """Verify history endpoint returns a list."""
    response = client.get("/api/v1/history")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_alerts():
    """Verify emergency alerts endpoint returns a list."""
    response = client.get("/api/v1/alerts")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    