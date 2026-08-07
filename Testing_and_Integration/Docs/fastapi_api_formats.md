# FastAPI Request and Response Formats

## Project
AI-Based Smart Steering Wheel

---

# Purpose

FastAPI acts as the communication bridge between the AI model, Dashboard, and CARLA simulator.

---

# API 1: Health Data

### Endpoint

POST /health_data

### Request

```json
{
  "ecg": 0.92,
  "heart_rate": 118,
  "blood_pressure": "150/95",
  "spo2": 97,
  "temperature": 36.8
}
```

### Response

```json
{
  "status": "received",
  "message": "Health data stored successfully."
}
```

---

# API 2: Risk Prediction

### Endpoint

POST /risk_prediction

### Request

```json
{
  "risk_score": 0.95,
  "risk_level": "High",
  "emergency": true
}
```

### Response

```json
{
  "status": "Emergency Detected",
  "vehicle_control": "Activated"
}
```

---

# API 3: Vehicle Control

### Endpoint

POST /vehicle_control

### Request

```json
{
  "brake": true,
  "steering": 0,
  "hazard_lights": true
}
```

### Response

```json
{
  "status": "Vehicle Stopped Successfully"
}
```

---

# API 4: Emergency Alert

### Endpoint

POST /emergency_alert

### Request

```json
{
  "vehicle_number": "MH13AB1234",
  "latitude": 17.659,
  "longitude": 75.906,
  "emergency_contact": "+91XXXXXXXXXX"
}
```

### Response

```json
{
  "status": "Alert Sent"
}
```

---

# Integration Summary

AI Model
↓

ROS 2
↓

FastAPI
↓

Dashboard + CARLA + Emergency Services