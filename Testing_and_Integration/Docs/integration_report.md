# Integration Report

Status: Planned 

## Project
AI-Based Smart Steering Wheel for Driver Health Monitoring and Emergency Response

---

# Purpose

This document describes the planned integration of all project modules and the communication between them.

---

# Modules to be Integrated

| Module | Responsibility | Status |
|---------|----------------|--------|
| AI / ML | Predict driver's cardiac risk | In Progress |
| ROS 2 | Communication between modules | Planned |
| FastAPI | Backend services | In Progress |
| CARLA Simulator | Digital Twin & vehicle control | In Progress |
| Dashboard | Display health and emergency status | Planned |
| Testing & Integration | System integration and validation | In Progress |

---

# Planned Integration Flow

1. Sensors collect driver health data.
2. AI/ML model predicts the driver's risk.
3. ROS 2 publishes the prediction.
4. FastAPI receives the emergency status.
5. Dashboard displays driver information.
6. CARLA simulates emergency vehicle actions.
7. Emergency alerts are sent to contacts.

---

# Current Project Status

- Individual modules are under development.
- Integration testing has not yet started.
- Test cases have been prepared.
- Final integration will begin after all modules are completed.

---

# Expected Outcome

After integration, the system should:

- Detect cardiac emergencies.
- Stop the vehicle safely.
- Turn on hazard lights.
- Park safely.
- Send GPS location.
- Notify emergency contacts.
- Display emergency status on the dashboard.

---

# Remarks

This report will be updated after complete system integration and testing.