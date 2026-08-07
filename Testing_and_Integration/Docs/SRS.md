# Software Requirements Specification (SRS)
## Smart Steering Wheel - Real-Time Health & Cardiac Attack Detection System

---

## 1. Introduction
### 1.1 Purpose
This document specifies the official software requirements for the **Smart Steering Wheel Health Monitoring System**. The system continuously monitors the driver's physiological indicators—specifically **ECG, Sweat (GSR), Blood Pressure, and Stress levels**—to detect early signs of severe fatigue, stress, and imminent **Cardiac Attack (Myocardial Infarction)** during vehicle operation.

### 1.2 System Overview
Sensors embedded in the steering wheel continuously capture multi-modal physiological telemetry. This data is streamed via WebSockets to a local backend, processed through AI/ML models to classify health risks and cardiac metrics, and rendered in real time on a React frontend dashboard. Immediate visual and acoustic warnings trigger when critical cardiac or high-stress anomalies are detected.

---

## 2. Component Roles & Responsibilities

| Role | Module Path | Core Responsibility |
| :--- | :--- | :--- |
| **Backend Engineer** | `/backend` | FastAPI server, WebSocket data pipeline (`/api/v1/stream`), real-time sensor processing |
| **AI/ML Engineer** | `/AIML` | ECG signal feature extraction, stress estimation, cardiac attack risk classification models |
| **Frontend Developer**| `/Frontend` | Live ECG waveform plotting, real-time vital signs dashboard, emergency warning banners |
| **Testing & Integration Lead** | `/Testing_and_Integration` | Schema validation, end-to-end integration tests, WebSocket latency verification |

---

## 3. System Data Contract & API Schema

### 3.1 Telemetry Payload Schema
All continuous health telemetry transmitted over the WebSocket endpoint (`/api/v1/stream`) must strictly conform to the following JSON structure:

```json
{
  "timestamp": "2026-07-31T10:15:00Z",
  "ecg_bpm": 85,
  "blood_pressure": {
    "systolic": 120,
    "diastolic": 80
  },
  "sweat_gsr": 4.2,
  "stress_index": 35.0,
  "cardiac_risk_level": "NORMAL",
  "status": "GREEN"
}